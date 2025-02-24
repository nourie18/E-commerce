const express=require("express")
const router=express.Router()
const Categorie=require('../Model/categorie')

router.get('/',async (req,res)=>{
    try{
        const cat = await Categorie.find({},null,{sort:{'_id':-1}})
        res.status(200).json(cat)
    }catch(err){
        res.status(404).json({message:err.message})
    }
})
router.post('/',async (req,res)=>{
    const { nomcategorie, imagecategorie} = req.body;
    const newCategorie= new Categorie({nomcategorie:nomcategorie,imagecategorie:imagecategorie})
    try{
        await newCategorie.save()
        res.status(200).json(newCategorie)
    }catch(err){
        res.status(404).json({message:err.message})
    }
})
router.get('/:categorieID',async (req,res)=>{
    try { const cat1 = await Categorie.findByIdAndUpdate(
        req.params.categorieId,
        { $set: req.body },
        { new: true } ); 
        res.status(200).json(cat1); 
    }catch (err) { 
        res.status(404).json({message:err.message})
    }      
})  
router.put('/:categorieID',async (req,res)=>{

})
router.delete('/:categorieID',async (req,res)=>{
    const id = req.param.CategorieID
    await Categorie.findByIdAndDelete(id),
    res.json({message:"categorie deleted succesfully ."})
})
module.exports=router