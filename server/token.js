const jwt = require('jsonwebtoken');
const serect = require('./config').token_serect;  //密钥，不能丢

function addToken(json_data){
    return jwt.sign(json_data,serect,{expiresIn:'1h'})
}
function getToken(token_data){
    //token_data='Bearer token'
    return jwt.decode(token_data.split(' ')[1],serect)
}

exports.set=addToken
exports.get=getToken