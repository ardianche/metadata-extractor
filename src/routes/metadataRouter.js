var express = require('express')
var router = express.Router();

const ebookService = require('../services/EbookService');
const $ebook = new ebookService();

router.get('/authors',async (req,res)=>{
    //Select all authors
    res.send(await $ebook.getAuthors());
});

router.get('/author/:authorName',async (req,res)=>{
    res.send(await $ebook.getAuthorBooks(req.params.authorName));
});

router.get('/titles',async (req,res)=>{
    res.send(await $ebook.getTitles());
});

router.get('/title/:titleKeyword',async (req,res)=>{
    //Select title with specific ID 
    res.send(await $ebook.getTitleByKeyword(req.params.titleKeyword))
});

/*
    Quickly search between different fields
*/

router.get('/custom',async(req,res)=>{
    res.send(await $ebook.customQuerying(req.body));
})

module.exports = router