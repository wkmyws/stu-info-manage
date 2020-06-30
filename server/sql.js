const mysql=require('mysql')
const { json } = require('express')
const sqlPwn=require('./config').sqlPwn
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:sqlPwn,
    database:'stu_info',
})
connection.connect()

function toJson(res){
    return JSON.parse(JSON.stringify(res))
}
async function query(sql,list){
    return new Promise((resolve,reject)=>{
        connection.query(sql,list,(err,res)=>{
            if(err)return reject(err)
            return resolve(toJson(res))
        })
    })
}
async function loginTest(usr,pwd){
    //成功匹配用户名密码
    let res=await query('select * from login where usr=? and pwd=? limit 1;',[usr,pwd])
    if(res.length>0)return {stat:0,type:res[0]["type"]}
    //匹配到用户名
    res=await query('select * from login where usr=? limit 1;',[usr])
    if(res.length>0)return {stat:1,msg:"密码错误"}
    //不存在此用户名
    return {stat:2,msg:"学号不存在，请联系管理员添加记录"}
}

async function getInfoByUsr(usr){//ret json-data
    let res=await query("select * from stu where usr=? limit 1;",[usr])
    return res.length?res[0]:null
}

async function updateInfo(usr,json_data){//ret {stat,msg}
    try{
        let res=await query(
            'update stu set name=?,class_by_name=?,class_by_no=?,stu_pos=?,prize=? where usr=?;',
            [json_data.name,json_data.class_by_name,json_data.class_by_no,json_data.stu_pos,json_data.prize,usr],
        )
    }catch(err){
        return {stat:1,msg:err}
    }
    return {stat:0}
}

async function updatePwd(usr,pwd){//ret {stat,msg}
    if(!pwd)return {stat:1,msg:"密码不能为空"}
    try{
        let res=await query(
            'update login set pwd=? where usr=?;',
            [pwd,usr],
        )
    }catch(err){
        return {stat:1,msg:err}
    }
    return {stat:0}
}

async function addUsr(usr,pwd){
    if(!usr)return {stat:1,msg:"未输入字段"}
    pwd=pwd||usr
    try{
        await query('insert into login(usr,pwd,type) values(?,?,?);',[usr,pwd,"stu"])
        await query('insert into stu(usr) values(?);',[usr])
    }catch(e){
        return {stat:1,msg:"此账户已经存在，不可新增"}
    } 
    return {stat:0}
    
}

async function delUsr(usr){
    if(!usr)return {stat:1,msg:"未输入字段"}
    let res=await query('delete from login where usr=?',[usr])
    await query('delete from stu where usr=?',[usr])
    if(res.affectedRows){
        return {stat:0}
    }
    return {stat:1,msg:"此账户不存在，无需删除"}
}

async function search(list){
    let partSql=[]
    //拼接sql语句
    if(list.usr)partSql.push(mysql.format("usr regexp ?",list.usr))
    if(list.name)partSql.push(mysql.format("name regexp ?",list.name))
    if(list.class_by_name)partSql.push(mysql.format("class_by_name regexp ?",list.class_by_name))
    if(list.class_by_no)partSql.push(mysql.format("class_by_no regexp ?",list.class_by_no))
    if(list.stu_pos)partSql.push(mysql.format("stu_pos regexp ?",list.stu_pos))
    if(list.prize)partSql.push(mysql.format("prize regexp ?",list.prize))
    partSql=partSql.join(" and ")
    if(partSql)partSql=" where "+partSql;
    partSql+=";"
    
    let res;
    try{
        res=await query("select usr,name,class_by_no,class_by_name from stu"+partSql)
        return {stat:0,list:res}
    }catch(err){return {stat:1,msg:err}}
}

exports.loginTest=loginTest
exports.getInfoByUsr=getInfoByUsr
exports.updateInfo=updateInfo
exports.updatePwd=updatePwd
exports.addUsr=addUsr
exports.delUsr=delUsr
exports.search=search