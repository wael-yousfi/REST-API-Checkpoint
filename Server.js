const mongoose = require("mongoose")
const express = require('express')
const users = require('./models/User')
const app= express()
const port = 5667  
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, 'config', '.env') });
console.log(process.env.MONGO_URI)
app.use(express.json())
//Connect to data base

mongoose
    .connect(process.env.MONGO_URI,{family:4})
    .then(()=> console.log("Connected to MongoDB"))
    .catch(err=> console.log('Could not connect to Data base', err.message))
app.listen(port, console.log(`server is runing at http://localhost:${port}`))
//Route
app.post('/post/',async(req,res)=>{
    const {name,email,postename,phone}= req.body
    if (!name || !email){
        throw new Error ('Please include all fields')
    }
    //check if user exists
    const userExists = await users.findOne({email})
    if (userExists){
        res.status(400)
        throw new Error ('User already exists')
    }
    //create user
    const user = new users (req.body)
    await user.save()
    if (user){
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
           
        })
    }else{
        res.status(400)
        throw new Error('Invalid user data')
    }
})

app.get('/get/', async(req,res)=>{
    try {
        const AllUsers = await users.find()
        res.status(200).send({msg:"ok",AllUsers})
    } catch (error) {
        res.status(500).send({msg:"error"})
    }
})
app.put('/update/:id', async(req,res)=>{
    try {
        const userUpdate = await users.findByIdAndUpdate(req.params.id,{$set:req.body})
        res.status(200).send({msg:"user modifier",userUpdate})
    } catch (error) {
        res.status(500).send({msg:"error"})
    }
})

app.delete('/delete/:id', async(req,res)=>{
    try {
        const userDelete= await users.findByIdAndDelete(req.params.id)
        res.status(200).send({msg:"user supprimer",userDelete})
    } catch (error) {
        res.status(500).send({msg:"error"})
    }
})