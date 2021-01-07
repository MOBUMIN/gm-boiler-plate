const mongoose = require('mongoose');
const bycrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        maxlength: 50
    },
    email:{
        type: String,
        trim: true,
        unique: 1
    },
    password:{
        type: String,
        minlength: 5
    },
    lastname:{
        type:String,
        maxlength: 50
    },
    role:{
        type: Number,
        default: 0
    },
    image:String,
    token:{
        type: String
    },
    tokenExp:{
        type: Number
    }
})

userSchema.pre('save',function( next ){
    var user = this;

    if(user.isModified('password')){
    //비밀번호 암호화
        bycrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)

            bycrypt.hash(user.password,salt,function(err,hash){
                if(err) return next(err)
                user.password=hash
                next()
            });
        });
    }else{
        next()
    }
})


userSchema.methods.comparePassword = function(plainPassword, cb){
    // plain 1234567 === 암호화된 번호
    // plain을 암호화해서 같은지 확인
    bycrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    //jsonwebtoken을 이용하여 토큰 생성
    var token = jwt.sign(user._id.toHexString(),'secretToken')

    user.token = token
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null, user)
    })
}


const User = mongoose.model('User', userSchema)

module.exports = { User }