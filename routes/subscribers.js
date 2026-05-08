const express=require('express');
const router=express.Router();
const Subscriber=require('../models/subscriber');

//Getting all subscribers
router.get('/',async (req,res)=>{
    try{
        const subscribers=await Subscriber.find()
        res.status(200).json({
            success:true,
            data:subscribers
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }

})
//Getting one subscriber
router.get('/:id',getSubscriber,(req,res)=>{
    res.status(200).json({
        success:true,
        data:res.subscriber
    })

})
//Creating one subscriber
router.post('/',async (req,res)=>{
    const name = req.body.name && req.body.name.trim()
    const subscribedToChannel = req.body.subscribedToChannel && req.body.subscribedToChannel.trim()
    if(!name || !subscribedToChannel){
        return res.status(400).json({
            success:false,
            message:"Name and subscribedToChannel are required"
        })
    }
    const subscriber= new Subscriber({
        name,
        subscribedToChannel
    })
    try{
        const newSubscriber = await subscriber.save()
        res.status(201).json({
            success: true,
            message: "Subscriber created",
            data: newSubscriber
          })
    }
    catch(err){
        res.status(400).json({
            success: false,
            message: err.message
          })
    }

})
//Updating one subscriber
router.patch('/:id',getSubscriber,async (req,res)=>{
    const hasName = Object.prototype.hasOwnProperty.call(req.body, 'name')
    const hasChannel = Object.prototype.hasOwnProperty.call(req.body, 'subscribedToChannel')
    if(!hasName && !hasChannel){
        return res.status(400).json({
            success:false,
            message:"Provide name or subscribedToChannel to update"
        })
    }
    if(req.body.name != null){
        if(typeof req.body.name !== 'string' || req.body.name.trim() === ''){
            return res.status(400).json({
                success:false,
                message:"name must be a non-empty string"
            })
        }
        res.subscriber.name=req.body.name.trim()
    }
    if(req.body.subscribedToChannel != null){
        if(typeof req.body.subscribedToChannel !== 'string' || req.body.subscribedToChannel.trim() === ''){
            return res.status(400).json({
                success:false,
                message:"subscribedToChannel must be a non-empty string"
            })
        }
        res.subscriber.subscribedToChannel=req.body.subscribedToChannel.trim()
    }
    try{
        const updatedsubscriber= await res.subscriber.save()
        res.status(200).json({
            success: true,
            message: "Subscriber updated",
            data: updatedsubscriber
          })
    }
    catch(err){
        res.status(400).json({
            success:false,
            message:err.message
        })
    }
})
    


//Deleting one subscriber
router.delete('/:id',getSubscriber,async (req,res)=>{
    try{
        await res.subscriber.deleteOne()
        res.status(200).json({
            success: true,
            message: "Subscriber deleted"
          })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
})

async function getSubscriber(req,res,next){
    let subscriber
    try{
        subscriber=await Subscriber.findById(req.params.id)
        if(subscriber==null){
            return res.status(404).json({
                success: false,
                message: "Subscriber not found"
              });
        }
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
    res.subscriber=subscriber
    next()
}

module.exports=router