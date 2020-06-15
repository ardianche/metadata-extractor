const Sequelize = require('sequelize');
const Model = Sequelize.Model;

const sequelize = require('../config/db');
console.log('test: ');

class Ebook extends Model {
    getAuthor(){
        return this.author;
    }
}
Ebook.init({
    id : {
        primaryKey:true,
        type:Sequelize.INTEGER,
    },
    title : Sequelize.TEXT,
    author: Sequelize.TEXT,
    publisher : Sequelize.STRING,
    publicationDate: Sequelize.DATEONLY,
    language: Sequelize.STRING,
    subjects: Sequelize.TEXT,
    license: Sequelize.TEXT,
}, { sequelize, modelName: 'ebook' });

Ebook.sync({force:false});

module.exports = Ebook;