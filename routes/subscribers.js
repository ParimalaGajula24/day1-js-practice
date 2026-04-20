const express=require('express');
const router=express.Router();
const Subscriber=require('../models/subscriber');

//Getting all subscribers
router.get('/',async (req,res)=>{
    try{
        const subscribers=await Subscriber.find()
        res.status(200).json({
            status:true,
            data:subscribers
        })
    }
    catch(error){
        res.status(500).json({
            status:false,
            message:error.message
        })
    }

})
//Getting one subscriber
router.get('/:id',getSubscriber,(req,res)=>{
    res.status(200).json({
        status:true,
        data:res.subscriber
    })

})
//Creating one subscriber
router.post('/',async (req,res)=>{
    const subscriber= new Subscriber({
        name:req.body.name,
        subscribedToChannel:req.body.subscribedToChannel
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
    if(req.body.name != null){
        res.subscriber.name=req.body.name
    }
    if(req.body.subscribedToChannel != null){
        res.subscriber.subscribedToChannel=req.body.subscribedToChannel
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
        res.status(400).json({msg:err.message})
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
        res.status(500).json({msg:err.message})
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
        return res.status(500).json({msg:err.message})
    }
    res.subscriber=subscriber
    next()
}

module.exports=router