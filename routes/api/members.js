const express = require('express');
const uuid=require('uuid');
const router=express.Router();
const members=require('../../Members');
//get all members
router.get('/',(req,res)=>res.json(members))
//get single member
router.get('/:id',(req,res)=>{
    const found = members.some(member => member.id === parseInt(req.params.id));
    if (found){
        res.json(members.filter(member => member.id === parseInt(req.params.id)));
    }
    else{
        res.status(400).json({msg : `No  member with the ${req.params.id}`});
    }
    
})

//create member
router.post('/',(req,res)=>{
    const newmember={
        id:uuid.v4(),
        name:req.body.name,
        email:req.body.email,
        status:'active'
    }
    if(!newmember.name || !newmember.email){
        return res.status(400).json({msg: "Please include a name and email"});
    }
    members.push(newmember);
    res.json(members);
});

//update member

router.put('/:id',(req,res)=>{
    const found = members.some(member => member.id === parseInt(req.params.id));
    if (found){
        const updmember=req.body;   
        members.forEach(member =>{
            if(member.id === parseInt(req.params.id)){
                member.name=updmember.name ? updmember.name : member.name,
                member.email=updmember.email ? updmember.email : member.email
                res.json({msg: 'Member was updated',member});
            }
        });
    }
    else{
        res.status(400).json({msg : `No  member with the ${req.params.id}`});
    }
    
})

router.delete('/:id',(req,res)=>{
    const found = members.some(member => member.id === parseInt(req.params.id));
    if (found){
        res.json({msg:'Member has been deleted',members : members.filter(member => member.id !== parseInt(req.params.id))});
    }
    else{
        res.status(400).json({msg : `No  member with the ${req.params.id}`});
    }
    
})

module.exports=router;