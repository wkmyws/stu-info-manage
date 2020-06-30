//用于存放全局配置

//端口号
const port=3028
exports.port=port

const allowRegister=true
exports.allowRegister=allowRegister

const sqlPwn="your password"
exports.sqlPwn=sqlPwn

//session配置
const sessionConfig = {
    key: 'koa:sess',   //cookie key (default is koa:sess)
    maxAge: 1000*60*30,  // 30 min 失效
    overwrite: true,  //是否可以overwrite    (默认default true)
    httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
    signed: true,   //签名默认true
    rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
    renew: false,  //(boolean) renew session when session is nearly expired,
}
exports.sessionConfig=sessionConfig

// 这个是配合signed属性的签名key
const session_signed_key = ["signed key you should set"]
exports.session_signed_key=session_signed_key

//token密钥
const token_serect = 'token secret you should set'
exports.token_serect=token_serect
