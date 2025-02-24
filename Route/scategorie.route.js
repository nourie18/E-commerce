const express=require("express")
const router=express.Router()
const SCategorie = require("../Model/souscategorie")
const souscategorie = require("../Model/souscategorie")

router.get("/", async (req,res)=>{
    try{
        const scat = await SCategorie.find({},null ,{sort: {'_id':1}}).populate("categorieID")
        res.status(200).json(scat)
    }catch(err){
        res.status(404).json({message:err.message})
    }
})
router.post('/', async(req,res)=>{
    const {nomscategorie,imagescat,categorieID} =req.body
    const newSCategorie = new SCategorie({nomscategorie:nomscategorie,imagescat:imagescat,categorieID:categorieID})
    try{
        await newSCategorie.save()
        res.status(200).json(newSCategorie)
    }catch(err){
        res.status(404).json({message:err.message})
    }
})
router.get("/:scategorieId",async(req,res)=>{
    try{
        const scat=await SCategorie.findById(req.params.scategorieId)
        res.status(200).json(scat)
    }catch(err){
        res.status(404).json({ message: err.message });
    }
})
router.put('/:scategorieId',async(req,res)=>{
    try{
        const scat1 = await SCategorie.findByIdAndUpdate( req.params.scategorieId, { $set: req.body }, { new: true } );
        res.status(200).json(scat1)
    }catch(err){
        res.status(404).json({message:err.message})
    }
})
router.delete('/:scategorieId',async(req,res)=>{
    const id = req.params.scategorieId
    const scat = await SCategorie.findByIdAndDelete(id)
    res.json({message:"sous categorie deleted successfully"})
})
router.get("/cat/:scategorieID",async(req,res)=>{
    try{
        const scat =await SCategorie.find({categorieID: req.params.categorieID}).exec()
        res.status(200).json(scat)
    }catch(err){
        res.status(404).json({message:err.message})
    }
})
module.exports=router