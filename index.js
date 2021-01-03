const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } = require('./models/User');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const config = require('./config/key');
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,{
useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false}).then(()=>console.log('good'))
.catch(err=>console.log(err))

app.get('/', (req,res)=>res.send('npm install nodemon--save-dev'))

app.post('/register',(req,res)=>{
    //회원가입시 필요 정보를 client에서 받아오면
    //그것을 db에 넣음.
    const user = new User(req.body)

    user.save((err,userInfo)=>{
        if(err) return res.json({success:false,err})
        return res.status(200).json({success:true})
    })
})

app.listen(port, ()=>console.log(`Example app ${port}`))