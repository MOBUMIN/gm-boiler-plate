if(process.env.NODE_ENV==='production'){
    //배포한 후에는 NODE_ENV가 위에 글로 나옴
    module.exports = require('./prod');
}else{
    module.exports = require('./dev');
}