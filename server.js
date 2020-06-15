const fs = require('fs');
const express = require('express')
const app = express();
const cheerio   =   require("cheerio");
const sequelize = require('./src/config/db');

const xml2js = require('xml2js');
const bodyParser = require('body-parser')

let parser = new xml2js.Parser();


let ebookService,ebook;

let metadataRouter = require('./src/routes/metadataRouter');

app.use(bodyParser.json());
app.use('/metadata',metadataRouter);


app.listen(7070,()=>{
    console.log('listening on port 7070');
    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');  
            ebookService = require('./src/services/EbookService');
            ebook = new ebookService();

            /*
                The following initiates the parsing and inserting of rdf files.
            */
            (async () => {
                await retrieveFolders('/Users/ardian/Desktop/rdf-files/cache/epub')
            })();
            
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    
});

async function retrieveFolders(path){
    await fs.readdir(path, async (error,subfolder)=>{
        await subfolder.forEach(subdir => { 
            processFile(path+'/'+subdir);
        });
    });
}

 async function processFile(path){
     await fs.readdir(path,'utf-8', (error,file)=>{
         parseFile(path+'/'+file,async (data) => {
             if(data != undefined){
                 parseRDF(path + '/' + data,(file)=>{
                     parser.parseStringPromise(file).then((res) => {
                         let mainStructure = res['rdf:RDF']['pgterms:ebook'][0];
                         let parsedObject = {
                             id : !!mainStructure['$']['rdf:about'] && mainStructure['$']['rdf:about'].replace('ebooks/',''),
                             author : mainStructure['dcterms:creator'] != undefined ? mainStructure['dcterms:creator'][0]['pgterms:agent'].map((author,index) =>{
                                let authors = !!author['pgterms:name'] && author['pgterms:name'][0];
                                 return {
                                     name: authors + (index == mainStructure['dcterms:creator'][0]['pgterms:agent'].length - 1 ? '' : ',')
                                 }
                             })[0].name : 'N/A',
                             publisher: mainStructure['dcterms:publisher'][0],
                             title: mainStructure['dcterms:title'][0],
                             subjects :!!mainStructure['dcterms:subject'] && mainStructure['dcterms:subject'].map((sub,index)=>{
                                 let subjects = sub['rdf:Description'][0]['rdf:value'][0];
                                 return {
                                     subject: subjects + (index == (mainStructure['dcterms:subject'].length-1 )? '' : ','),
                                 }
                             })[0]['subject'],
                             language: mainStructure['dcterms:language'][0]['rdf:Description'][0]['rdf:value'][0]['_'],
                             license: mainStructure['dcterms:license'][0]['$']['rdf:resource'],
                             publicationDate: mainStructure['dcterms:issued'][0]['_'],
                             rights: mainStructure['dcterms:rights'][0],
                         }
                        ebook.insertEbook(parsedObject);
                     }).catch(err => {
                         console.log('error : ',err);
                     });
                 });
             }
         });
     });

 }

 async function parseFile(path,callback){
     await fs.readFile(path,(error,data)=>{
         callback(data);
     });
 }

 function parseRDF(filename,callback){
     fs.readFile(filename,function(err,data){
         if(err){return callback(err);}
         let
             $=cheerio.load(data.toString()),
             collect=function(index,elem){
                 return $(elem).text();
             };
             callback(null,{
                 _id:$("pgterms\\:ebook").attr("rdf:about").replace("ebooks/",""),
                 title:$("dcterms\\:title").text(),
                 authors:$("pgterms\\:agent pgterms\\:name").map(collect),
                //  subjects: $('[rdf\\:resource$="/LCSH"] ~ rdf\\:value').map( collect)  //it didn't work
                 subjects:$("[rdf\\:resource$='/LCSH']").parent().find("rdf\\:value").map(collect)  //replacement to 41
             });
     });
 };
