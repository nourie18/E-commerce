const express = require("express")
const axios = require("axios")
const Message =require('../Model/message')

const router = express.Router()
router.use(express.json())
router.post("/ask", async(req,res)=>{
    try{
        const { question } = req.body
        if (!question) return res.status(404).json({error:"Question required"})
        const  {data}= await axios.post(process.env.OLLAMA_API_URL,{
            model: process.env.OLLAMA_MODEL,
            prompt: question,
            stream: false 
        },{
            headers:{"Content-Type":"application/json"}
        })
        if(!data || !data.response) throw new Error("Réponse invalide d'Ollama")
        const responseText=data.response
        console.log(`Réponse Ollama: ${responseText}`)
        const newMessage = new Message({ text: question, response: responseText }); await newMessage.save();
        res.json({question,response:responseText})
    }catch(err){
        res.status(500).json({erreur:"Erreur interne",detail:err.Message})
    }
})
router.get("/messages",async(req,res)=>{
    try{
        const messages = await Message.find()
        res.json(Message)
    }catch(err){
        res.status(600).json({erreur:"Erreur de recupération",detail:err.message})
    }
})
module.exports=router;