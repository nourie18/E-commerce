const express = require('express'); 
const router = express.Router(); 
const Article=require("../Model/article") 
const Scategorie =require("../Model/souscategorie")  
router.get('/', async (req, res, )=> 
{ try { 
    const articles = await Article.find({}, null, {sort: {'_id': -1}}).populate("scategorieID").exec();
    res.status(200).json(articles);
 } catch (error) 
 { res.status(404).json({ message: error.message }); } 
});  
router.post('/', async (req, res) => {
     const nouvarticle = new Article(req.body) 
     try { 
        await nouvarticle.save();
        res.status(200).json(nouvarticle ); 
    }catch (error) {
         res.status(404).json({ message: error.message }
    );
} });  
router.get('/pagination', async(req, res) => {
    const page = req.query.page ||1 
    const limit = req.query.limit ||5; 
    const offset = (page - 1) * limit; 
    try {
        const articlesTot = await Article.countDocuments();
        const articles = await Article.find( {}, null, {sort: {'_id': -1}}) .skip(offset) .limit(limit) 
        res.status(200).json({articles:articles,tot:articlesTot}); 
    }catch (error) { res.status(404).json({ message: error.message }); } });  
router.get('/:articleId',async(req, res)=>{ 
    try { 
        const art = await Article.findById(req.params.articleId); 
        res.status(200).json(art); 
    }catch (error) { res.status(404).json({ message: error.message }); } }); 
router.put('/:articleId', async (req, res)=> {
    try {
        const art = await Article.findByIdAndUpdate( req.params.articleId, { $set: req.body }, { new: true } ); 
        const articles = await Article.findById(art._id).populate("scategorieID").exec();
        res.status(200).json(articles); 
    }catch (error) { res.status(404).json({ message: error.message }); } });
router.delete('/:articleId', async (req, res)=> {
    const id = req.params.articleId; 
    await Article.findByIdAndDelete(id); 
    res.json({ message: "article deleted successfully." }); }); 
router.get('/scat/:scategorieID',async(req, res)=>{
    try { 
        const art = await Article.find({ scategorieID: req.params.scategorieID}).exec(); 
        res.status(200).json(art); 
    }catch (error) { res.status(404).json({ message: error.message }); } }); 
router.get('/cat/:categorieID', async (req, res) => {
    try { 
        const sousCategories = await Scategorie.find({ categorieID: req.params.categorieID }).exec(); 
        const sousCategorieIDs = sousCategories.map(scategorie => scategorie._id); 
        const articles = await Article.find({ scategorieID: { $in: sousCategorieIDs } }).exec(); 
        res.status(200).json(articles); }
        catch (error) { res.status(404).json({ message: error.message }); } }); 
module.exports = router;