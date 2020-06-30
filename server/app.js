const Config=require('./config')
const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router')
const 验证码=require("./验证码")
const session = require('koa-session');
const sql=require('./sql')
const {sign} =require('jsonwebtoken')
const cors=require('koa2-cors')
const token=require('./token')

app.use(cors({
    credentials:true,//默认情况下，Cookie不包括在CORS请求之中。设为true，即表示服务器许可Cookie可以包含在请求中
    origin: ctx => ctx.header.origin, // web前端服务器地址，注意这里不能用*
}))
app.use(bodyParser());

//session配置
app.keys = Config.session_signed_key;
app.use(session(Config.sessionConfig, app));

//token中间件，设置ctx.myToken= json || null
app.use(async(ctx,next)=>{
    let _token=ctx.request.header.authorization
    if(!_token){
        ctx.myToken=null
    }else{
        _token=token.get(_token)
        if( !_token || _token.exp<new Date()/1000){
            ctx.myToken=null
        }else{
            ctx.myToken=_token
        }
    }
    await next()
})

//路由配置
const router=new Router();

router.post('/register',async(ctx,next)=>{
    if(Config.allowRegister==false){
        ctx.body={stat:1,msg:"已禁止个人注册，请联系管理员注册账户"}
        return
    }
    if((!ctx.request.body["vrCode"]) || ctx.request.body["vrCode"]!=ctx.session.verificationCode){
        ctx.session.verificationCode=undefined
        ctx.body={
            "stat":1,
            "msg":"验证码错误"
        }
        return
    }
    ctx.body=await sql.addUsr(ctx.request.body.usr,ctx.request.body.pwd)
})

router.post('/login',async(ctx,next)=>{
    //登录
    //校验验证码
    if((!ctx.request.body["vrCode"]) || ctx.request.body["vrCode"]!=ctx.session.verificationCode){
        ctx.session.verificationCode=undefined
        ctx.body={
            "stat":1,
            "msg":"验证码错误"
        }
        return
    }
    //匹配学号密码
    const stat=await sql.loginTest(ctx.request.body["usr"],ctx.request.body["pwd"])
    if(stat.stat===0){
        ctx.body={
            "stat":0,
            "token":token.set({
                usr:ctx.request.body["usr"],
                pwd:ctx.request.body["pwd"],
                type:stat.type,
            }),
            "type":stat.type
        }
    }else{
        ctx.body={
            "stat":1,
            "msg":stat.msg
        }
    }
})
router.get('/login',async(ctx,next)=>{
    const verificationCode=await 验证码.getNumber()
    ctx.session.verificationCode=verificationCode.key
    ctx.body=verificationCode.svg
})

router.get("/info",async(ctx,next)=>{
    if(ctx.myToken){
        ctx.body=JSON.stringify(ctx.myToken)
        if(ctx.myToken["type"]==="admin"){
            //管理员返回的数据
            let usr=ctx.request.header.referer.split("?usr=")[1]
            let stu_info=await sql.getInfoByUsr(usr);
            //增加管理员标记字段
            stu_info["isAdmin"]=true
            //ret
            ctx.body={stat:0,info:stu_info}
        }else{
            //普通学生填写信息数据
            let stu_info=await sql.getInfoByUsr(ctx.myToken["usr"]);
            ctx.body={stat:0,info:stu_info}
        }
    }else ctx.body={stat:1,msg:"token错误，请登录"}
})

router.post("/info",async(ctx,next)=>{
    if(ctx.myToken){
        if(ctx.myToken["type"]!="admin" && ctx.myToken["usr"]!=ctx.request.body["usr"])
            ctx.body={stat:1,msg:"token不匹配，请重新登录"}
        else{
            //token认证成功，修改信息
            ctx.body=await sql.updateInfo(ctx.myToken["usr"],ctx.request.body)

        }
    }else ctx.body={stat:1,msg:"token错误，请登录"}
})

router.post("/pwd",async(ctx,next)=>{
    if(ctx.myToken){
        if(ctx.myToken["usr"]!=ctx.request.body["usr"]&&ctx.myToken["type"]!="admin")
            //如果usr不匹配并且不是管理员身份，则拒绝修改
            ctx.body={stat:1,msg:"token不匹配，请重新登录"}
        else{
            //token认证成功，修改信息
            ctx.body=await sql.updatePwd(ctx.request.body.usr,ctx.request.body.pwd)
        }
    }else ctx.body={stat:1,msg:"token错误，请登录"}
})

router.post("/addUsr",async(ctx,next)=>{
    if(ctx.myToken){
        if(ctx.myToken["type"]!="admin")
            //如果usr不匹配并且不是管理员身份，则拒绝修改
            ctx.body={stat:1,msg:"token不匹配，请重新登录"}
        else{
            //token认证成功，修改信息
            ctx.body=await sql.addUsr(ctx.request.body.usr)
        }
    }else ctx.body={stat:1,msg:"token错误，请登录"}
})

router.post("/delUsr",async(ctx,next)=>{
    if(ctx.myToken){
        if(ctx.myToken["type"]!="admin")
            //如果不是管理员身份，则拒绝修改
            ctx.body={stat:1,msg:"token不匹配，请重新登录"}
        else{
            //token认证成功，修改信息
            ctx.body=await sql.delUsr(ctx.request.body.usr)
        }
    }else ctx.body={stat:1,msg:"token错误，请登录"}
})

router.post("/search",async(ctx,next)=>{
    if(ctx.myToken){
        if(ctx.myToken["type"]!="admin")
            //如果不是管理员身份，则拒绝修改
            ctx.body={stat:1,msg:"token不匹配，请重新登录"}
        else{
            //token认证成功，修改信息
            ctx.body=await sql.search(ctx.request.body)
        }
    }else ctx.body={stat:1,msg:"token错误，请登录"}
})

app.use(router.routes());




// 监听3000端口
app.listen(Config.port)
