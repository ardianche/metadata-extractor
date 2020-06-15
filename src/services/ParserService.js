const ebookService = require('./EbookService');
const ebook = new ebookService();
const fs = require('fs')
const { promisify } = require('util');

const xml2js = require('xml2js');

let parser = new xml2js.Parser();


const readDirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);

class ParserService {
    constructor(){

    }

    async retrieveFolders(path){
        try{
            let directories = await readDirAsync(path);
            directories.forEach(dir => {
                // this.retrieveFile(path + '/' + dir);
            });
            return 'Successfully initiated retrieve file';
        }catch(err){
            return 'Error at ParserService.retrieveFolders';
        }
    }
    
    async retrieveFile(path){
        let file = await readDirAsync(path);
        let fileBuffer = await this.parseFile(path+'/'+file);
        await this.completeParse(fileBuffer);
        return file;
     }
    
    async parseFile(path,callback){
        let file = await readFileAsync(path);
        return file;
     }

    async completeParse(file){
        let object = {};
        await parser.parseStringPromise(file).then((res) => {
            let mainStructure = res['rdf:RDF']['pgterms:ebook'][0];
            let parsedObject = {
                id: !!mainStructure['$']['rdf:about'] && mainStructure['$']['rdf:about'].replace('ebooks/', ''),
                author: mainStructure['dcterms:creator'] != undefined ? mainStructure['dcterms:creator'][0]['pgterms:agent'].map((author, index) => {
                    let authors = !!author['pgterms:name'] && author['pgterms:name'][0];
                    return {
                        name: authors + (index == mainStructure['dcterms:creator'][0]['pgterms:agent'].length - 1 ? '' : ',')
                    };
                })[0].name : 'N/A',
                publisher: mainStructure['dcterms:publisher'][0],
                title: mainStructure['dcterms:title'][0],
                subjects: !!mainStructure['dcterms:subject'] && mainStructure['dcterms:subject'].map((sub, index) => {
                    let subjects = sub['rdf:Description'][0]['rdf:value'][0];
                    return {
                        subject: subjects + (index == (mainStructure['dcterms:subject'].length - 1) ? '' : ','),
                    };
                })[0]['subject'],
                language: mainStructure['dcterms:language'][0]['rdf:Description'][0]['rdf:value'][0]['_'],
                license: mainStructure['dcterms:license'][0]['$']['rdf:resource'],
                publicationDate: mainStructure['dcterms:issued'][0]['_'],
                rights: mainStructure['dcterms:rights'][0],
            };
            object = parsedObject;
            ebook.insertEbook(parsedObject);
        }).catch(err => {
            console.log('error : ', err);
        });
        return object;
    }

}

module.exports = ParserService;