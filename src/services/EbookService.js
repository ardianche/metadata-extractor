const Ebook = require('../model/Ebook');
const { Op } = require("sequelize");


class EbookService{
    constructor(){

    } 
    insertEbook(params) {
        Ebook.findOne({
            attributes:['id'],
            where:{
                id:params.id
            }
        }).then((res)=>{
            if(!!res && res.length == 0 || true){
                Ebook.create(params);
            }
        });


    }
    
    async getAuthors(){
        return await Ebook.findAll({attributes:['author']});
    }

    async getAuthorBooks(authorName){
        return await Ebook.findAll({
            where:{
                author:{
                    [Op.like] : `%${authorName}%` 
                }
            }
        })
    }

    async getTitles(){
        return await Ebook.findAll({attributes:['title']});
    }

    async getTitleByKeyword(keyword){
        return await Ebook.findAll({
            where:{
                title:{
                    [Op.like] : `%${keyword}%` 
                }
            }
        });
    }

    /*
        Quickly search between different fields
    */
    async customQuerying(params){
        console.log('date: ',params.publicationDate.split(' ')[0]);
        return await Ebook.findAll({
            where:{
                [Op.or]:{
                    title: !!params.title && {
                        [Op.like] : `%${params.title}%` 
                    } || null,
                    author: !!params.author && {
                        [Op.like] : `%${params.author}%` 
                    } || null,
                    publicationDate: !!params.publicationDate.split(' ')[0] && params.publicationDate.split(' ')[0] || null,
                }
            }
        });
    }
}

module.exports = EbookService;