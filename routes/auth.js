const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User=require('../models/User')
const authenticateToken = require('../middleware/auth')
const Post = require('../models/Post')

//registering a new user
router.post('/register',async (req,res)=>{
    try{
        const email = req.body.email && req.body.email.trim()
        const password = req.body.password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Email and password are required"
            })
        }
        //check if user exists
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }
        //hash password
        const hashedPassword=await bcrypt.hash(password,10)
        //create a new user 
        const user =new User({
            email,
            password:hashedPassword
        })
        await user.save()
        res.status(201).json({
            success:true,
            message:"User registered successfully",
            data:{
                _id:user._id,
                email:user.email
            }
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
})

//login
router.post('/login',async (req,res)=>{
    try{
        const email = req.body.email && req.body.email.trim()
        const password = req.body.password
        // validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            })
        }
        //1.find the user
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }
        //2.comparepasswords
        const isMatch = await bcrypt.compare(password,user.password)
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
    try{
        const user = await User.findById(req.user.userId)
        res.json({
            success: true,
            data: user
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
})

router.post('/posts',authenticateToken,async (req,res)=>{
    try{
        const {title,content}=req.body
        if(!title || !content || title.trim()==="" || content.trim()===""){
            return res.status(400).json({
                success:false,
                message:"Both title and content are required"
            })
        }
        const post=new Post({
            title:title.trim(),
            content:content.trim(),
            userId:req.user.userId
        })
        const savedPost=await post.save()
        res.status(201).json({
            success:true,
            data:savedPost
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:'Internal server error'
        })
    }
})

router.get('/posts',authenticateToken,async (req,res)=>{
    try{
        const posts = await Post.find({ userId: req.user.userId })
        res.status(200).json({
            success:true,
            data:posts
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
})

router.delete('/posts/:id',authenticateToken,async (req,res)=>{
    try{
        const postId=req.params.id
        //1.Find post
        const post= await Post.findById(postId)
        //2.check if exists
        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found"
            })
        }
        //3. Ownership
        if(post.userId.toString() !== req.user.userId){
            return res.status(403).json({
                success:false,
                message:"Unauthorized"
            })
        }
        //4/Delete post
        await post.deleteOne()
        res.status(200).json({
            success:true,
            message:"Post Deleted Successfully"
        })

    }
    catch(err){
        res.status(500).json(
            {
                success: false,
                message: err.message 
            }
        )
    }


})
module.exports=router