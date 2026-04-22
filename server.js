require('dotenv').config();
const express = require('express');
const app=express();
const authRouter=require('./routes/auth')
const mongoose = require('mongoose');
const cors=require('cors');


mongoose.connect(process.env.DATABASE_URL)

const db=mongoose.connection
db.on('error',(error)=>console.log(error));
db.once('open',()=>console.log('Connected to database'));
app.use(cors())
app.use(express.json());
const subscriberRouter=require('./routes/subscribers');
app.use('/subscribers',subscriberRouter);
app.use('/auth',authRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`server started on port ${PORT}`))