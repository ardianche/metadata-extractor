const fs = require('fs');
const express = require('express')
const app = express();

const sequelize = require('./src/config/db');
const ParserService = require('./src/services/ParserService');
const parserService = new ParserService();

const bodyParser = require('body-parser')


let ebookService,ebook;

let metadataRouter = require('./src/routes/metadataRouter');

app.use(bodyParser.json());
app.use('/metadata',metadataRouter);


app.listen(7070,()=>{
    sequelize
        .authenticate()
        .then(() => {
            console.log('test');
            /*
                The following initiates the parsing and inserting of rdf files.
            */
            (async () => {
                await parserService.retrieveFolders('/Users/ardian/Desktop/rdf-files/cache/epub');
            })();

        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    
});

 module.exports = app;