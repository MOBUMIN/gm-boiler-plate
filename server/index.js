const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } = require('./models/User');
const cookieParser = require('cookie-parser');
const {auth} = require('./middleware/auth');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

const config = require('./config/key');
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,{
useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false}).then(()=>console.log('good'))
.catch(err=>console.log(err))

app.get('/', (req,res)=>res.send('npm install nodemon--save-dev'))

app.post('/api/users/register',(req,res)=>{
    //회원가입시 필요 정보를 client에서 받아오면
    //그것을 db에 넣음.
    const user = new User(req.body)

    user.save((err,userInfo)=>{
        if(err) return res.json({success:false,err})
        return res.status(200).json({success:true})
    })
})

//login 기능
app.post('/api/users/login', (req,res)=>{
    //요청된 이메일을 데이터베이스에서 찾기
    User.findOne({ email:req.body.email }, (err, user)=>{
        if(!user){
            return res.json({
                loginSuccess:false,
                message: "유저가 없습니다."
            })
        }
        //이메일이 있다면 비밀번호가 같은지 확인
        user.comparePassword(req.body.password, (err, isMatch)=>{
            if(!isMatch)
            return res.json({
                loginSuccess: false,
                message: " 비밀번호가 틀림 "
            })
            //비밀번호가 맞다면 Token 생성
            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err);

                //토큰을 저장한다. => 쿠키, 로컬스토리지 ....
                res.cookie("x_auth", user.token).status(200).json({loginSuccess:true, userId: user._id})
            })
        })
    })
})

app.get('/api/users/auth', auth, (req,res)=>{
    // 미들웨어 통과 => Authentication : True
    // role : 0 => 일반유저
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth:true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res)=>{
    User.findOneAndUpdate(
        {_id: req.user._id},
        {token:""}, (err,user) => {
            if(err) return res.json({ success: false, err});
            return res.status(200).send({
                success:true
            })
        })
})

app.listen(port, ()=>console.log(`Example app ${port}`))