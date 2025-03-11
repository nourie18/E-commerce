require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app=express()
const cors= require("cors")
app.use(cors())
app.use(express.json())
const categorieRouter=require("./Route/categorie.route")
const scategorieRouter=require("./Route/scategorie.route")
const chatbotRouter=require("./Route/chatbot.route")
const articleRouter =require("./Route/article.route") 
const newUser = require("./Route/user.route")
app.use('/api/articles', articleRouter);
app.use("/api/categories",categorieRouter)
app.use("/api/scategories",scategorieRouter)
app.use("/api/chat",chatbotRouter)
app.use("/api/user",newUser)

app.get("/",(req,res)=>{
    res.send("Bienvenue dans notre site")
})
mongoose.connect(process.env.database)
    .then(() =>{console.log("DataBaseSuccessfullyConnected");
    }).catch(err=>{
    console.log('Unable to connect to database', err);
    process.exit();
    });

const PORT = process.env.PORT || 4000;
app.listen(PORT,function(){
    console.log("Serveur is listen on port 4000")
})
module.exports = app;