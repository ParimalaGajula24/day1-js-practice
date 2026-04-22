const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User=require('../models/User')
const authenticateToken = require('../middleware/auth')
const Post = require('../models/Post')

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