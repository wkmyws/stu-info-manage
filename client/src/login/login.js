import React, { useState,useEffect } from 'react';
import 'antd/dist/antd.css';
import './login.css'
import { Input,Button,Row,Col,Modal } from 'antd';

import { UserOutlined,KeyOutlined } from '@ant-design/icons';

const axios = require('axios')
const config=require("../config")

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem('token');

function Login(){
    let [usr,setUsr]=useState('')
    let [pwd,setPwd]=useState('')
    let [vrCode,setVrCode]=useState('')
    let [vrPct,setVrPct]=useState('正在加载验证码')

    useEffect(()=>{
        localStorage.removeItem("token")
        getVrPct()
    },[])

    function getVrPct(){//刷新验证码
        axios.get(config.server_ip+"/login")
            .then((res)=>{
                setVrPct(res.data)
                console.log(res)
            })
            .catch((err)=>{
                setVrPct("验证码获取失败")
                console.log(err)
            })
    }

    function register(){//注册按钮事件
        axios.post(config.server_ip+"/register",{
            usr:usr,pwd:pwd,
            vrCode:vrCode
        }).then((res)=>{
            localStorage.removeItem("token")
            res=res.data
            if(res.stat!=0){
                getVrPct();
                Modal.error({
                    content: res.msg,
                  });
            }else{//注册成功
                Modal.success({
                    content:"注册成功！请登录"
                })
            }
        })
    }

    function submit(){//登录按钮事件
        axios.post(config.server_ip+"/login",{
            "usr":usr,
            "pwd":pwd,
            "vrCode":vrCode
        }).then((res)=>{
            localStorage.removeItem("token")
            res=res.data
            if(res.stat!=0){
                getVrPct();
                Modal.error({
                    content: res.msg,
                  });
            }else{//成功登录
                localStorage.setItem("token",res.token)
                //切换stu/admin界面
                if(res.type=="stu")
                    window.location.href="./info"
                else if(res.type=="admin")
                    window.location.href="./admin"
                else{
                    Modal.error({
                        title: '无法识别的身份:'+res.type,
                        content: '请联系管理员',
                      });
                }
            }
        }).catch((err)=>{
            Modal.error({
                content: err,
              });
        })
    }

    return (<>
        <Row style={{marginTop:"20vh"}} justify="center" gutter={[8, 8]}>
            <Col><Input size="large" className="Input" value={usr} onChange={(e)=>setUsr(e.target.value)} placeholder="输入学号" prefix={<UserOutlined />} /></Col>
        </Row>
        <Row justify="center" gutter={[8, 8]}>
            <Col><Input.Password size="large" className="Input" value={pwd} onChange={(e)=>setPwd(e.target.value)} placeholder="输入密码(默认与学号相同)" prefix={<KeyOutlined />} /></Col>
        </Row>
        <Row justify="center" gutter={[8, 8]}>
            <Col><Input prefix={<span onClick={getVrPct} dangerouslySetInnerHTML={{__html:vrPct}}></span>} size="large" className="Input" value={vrCode} onChange={(e)=>setVrCode(e.target.value)} placeholder="输入图片验证码" /></Col>  
        </Row>
        <Row justify="center" gutter={[8, 8]}>
            <Col><Button size="large" className="btn-register" onClick={register} type="default">注册</Button></Col>
            <Col><Button size="large" className="btn-login" onClick={submit} type="primary">登录</Button></Col>
        </Row>
        

    </>)
}

export default Login