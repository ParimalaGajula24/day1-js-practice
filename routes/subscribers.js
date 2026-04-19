const express=require('express');
const router=express.Router();
const Subscriber=require('../models/subscriber');

//Getting all subscribers
router.get('/',async (req,res)=>{
    try{
        const subscribers=await Subscriber.find()
        res.json(subscribers)
    }
    catch(error){
        res.status(500).json({msg:error.message})
    }

})
//Getting one subscriber
router.get('/:id',getSubscriber,(req,res)=>{
    res.send(res.subscriber)

})
//Creating one subscriber
router.post('/',async (req,res)=>{
    const subscriber= new Subscriber({
        name:req.body.name,
        subscribedToChannel:req.body.subscribedToChannel
    })
    try{
        const newSubscriber = await subscriber.save()
        res.status(201).json(newSubscriber)
    }
    catch(err){
        res.status(400).json({msg:err.message})
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
        res.json(updatedsubscriber)
    }
    catch(err){
        res.status(400).json({msg:err.message})
    }
})
    


//Deleting one subscriber
router.delete('/:id',getSubscriber,async (req,res)=>{
    try{
        await res.subscriber.deleteOne()
        res.json({msg:"Deleted Subscriber"})
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
            return res.status(404).json({msg:"cannot find subscriber"});
        }
    }
    catch(err){
        return res.status(500).json({msg:err.message})
    }
    res.subscriber=subscriber
    next()
}

module.exports=router