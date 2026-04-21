const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User=require('../models/User')
const authenticateToken = require('../middleware/auth')

//registering a new user
router.post('/register',async (req,res)=>{
    try{
        //check if user exists
        const existingUser = await User.findOne({email:req.body.email})
        if(existingUser){
            return res.status(400).json({
                success:false,
                msg:"User already exists"
            })
        }
        //hash password
        const hashedPassword=await bcrypt.hash(req.body.password,10)
        //create a new user 
        const user =new User({
            email:req.body.email,
            password:hashedPassword
        })
        const newUser=await user.save()
        res.status(201).json({
            success:true,
            msg:"User registered successfully",
            data:newUser
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            msg:err.msg
        })
    }
})

//login
router.post('/login',async (req,res)=>{
    try{
        // validation
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            })
        }
        //1.find the user
        const user = await User.findOne({email:req.body.email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }
        //2.comparepasswords
        const isMatch = await bcrypt.compare(req.body.password,user.password)
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Invalid credentials"
            })
        }
        //3.Generate a token
        const token=jwt.sign(
            {userId:user._id},
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        //4.sends response
        res.status(200).json({
            success:true,
            message:"Login Successful",
            token
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
})


router.get('/protected', authenticateToken, (req, res) => {

    res.json({
        success: true,
        message: "Protected route accessed",
        user: req.user
    })
})

router.get('/profile', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.userId)

    res.json({
        success: true,
        data: user
    })
})

module.exports=router