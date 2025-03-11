const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User=require("../Model/user")
const nodemailer = require("nodemailer")
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"noureddinekarray4@gmail.com",
        pass:"wwcj jpgh wkbp jagb"
    },
    tls:{
        rejectUnauthorized:false
    }
})
router.post("/register",async (req, res)=>{
    try{
        let{email,password,firstname,lastname}=req.body
        const user = await User.findOne({ email })
        if(user)return res.status(404).send({success:false,message:"user already exist"})
        const newUser = new User({email,password,firstname,lastname})
        const createUser = await newUser.save()
        var mailOption ={
            from: '"verify your email " noureddinekarray4@gmail.com>',
            to: newUser.email,
            subject: 'vérification your email ',
            html:`<h2>${newUser.firstname}! thank you for registreting on our website</h2><h4>please verify your email to procced.. </h4><a href="http://${req.headers.host}/api/users/status/edit?email=${newUser.email}">click here</a>`
        }
        transporter.sendMail(mailOption,function(error,info){
            if(error){
                console.log(error)
            }
            else{
                console.log('verification email sent to your gmail account ')
            }
        })
        return res.status(201).send({ success: true, message: "Account created successfully", user: createUser });
    }catch(err){
        console.log(err)
        res.status(404).send({success:false,message:err})
    }
})
router.get('/', async (req, res, )=> {
    try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
});
router.get('/status/edit/', async (req, res) => {
    try {
    let email = req.query.email
    let user = await User.findOne({email})
    user.isActive = !user.isActive
    user.save()
    res.status(200).send({ success: true, user })
    } catch (err) {
    return res.status(404).send({ success: false, message: err })
    }
})
router.post("/login", async(req,res)=>{
    try{
        let {email, password} = req.body
        if(!email || !password){
            return res.status(404).send({success:false,message:"Field are required"})
        }
        let user = await User.findOne({email})
        if(!user){
            return res.status(404).send({success:false,message:"Account doesn't exist "})
        }else{
            let iscorrectPassword=await bcrypt.compare(password, user.password)
            if(iscorrectPassword){
                delete user._doc.password
                if(!user.isActive){
                    return res.status(200).send({success:true,message:"Your account is inactive please contact your administration"})
                }
                const token =jwt.sign({iduser:user._id,name:user.firstname, role: user.role}, process.env.SECRET, {expiresIn: "1h", })
            return res.status(200).send({success:true,user,token})
            }
            else{
                return res.status(404).send({success:false,message:"Please verifie your crendentials"})
            }
        }
        }catch(err){
            return res.status(404).send({success:false,message:err.message})
    }
})
router.get("/status/edit/",async(req,res)=>{
    try{
        let email=req.query.email
        console.log(email)
        let user = await User.findOne({email})
        user.isActive = !user.isActive
        user.save()
        res.status(200).send({success:true,user})
    }catch(err){
        res.status(404).send({success:false,message:err})
    }
})
module.exports = router