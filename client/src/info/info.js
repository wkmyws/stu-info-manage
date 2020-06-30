import React, { useState,useEffect } from 'react';
import 'antd/dist/antd.css';
import './info.css'
import { Input,Button,Row,Col,Divider,Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { TextArea } = Input;
const { confirm } = Modal;

const axios = require('axios')
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem('token');

const ip=require('../config').server_ip

const base62x=require('base62x')

function Info(){
    const [usr,setUsr]=useState('')
    const [name,setName]=useState('')
    const [class_by_name,setClass_by_name]=useState('')
    const [class_by_no,setClass_by_no]=useState('')
    const [stu_pos,setStu_pos]=useState('')
    const [prize,setPrize]=useState('')
    const [isAdmin,setIsAdmin]=useState(false)
    useEffect(()=>{
        axios.get(ip+"/info")
            .then((res)=>{
                res=res.data
                if(res.stat!=0){
                    Modal.error({
                        content: res.msg,
                      });
                }else{//成功获取数据
                    res=res.info
                    setIsAdmin(res.isAdmin||false)
                    setUsr(res.usr)
                    setName(res.name)
                    setClass_by_name(res.class_by_name)
                    setClass_by_no(res.class_by_no)
                    setStu_pos(res.stu_pos)
                    setPrize(res.prize)
                }
            }).catch((err)=>{
                Modal.error({
                    content: err,
                  });
            })
    },[])

    function updatePwd(){
        let a=prompt("输入你要修改的密码","")
        if(!a){
            Modal.info({content:"密码不能为空！修改失败！"})
            return
        }
        let b=prompt("再次输入你要修改的密码","")
        if(!b||a!=b)Modal.info({content:"两次输入的密码不一致！修改失败！"})
        else confirm({
            content:"确认修改密码？",
            onOk(){
                axios.post(ip+"/pwd",{usr:usr,pwd:a}).then((res)=>{
                    res=res.data
                    if(res.stat==0){
                        Modal.success({content:"修改成功！"})
                    }else Modal.error({content:res.msg})
                }).catch((err)=>Modal.error({content:err}))
            }
        })
    }

    function handleClick(){
        axios.post(ip+"/info",{
            usr:usr,
            name:name,
            class_by_name:class_by_name,
            class_by_no:class_by_no,
            stu_pos:stu_pos,
            prize:prize
        }).then((res)=>{
            res=res.data
            if(res.stat!=0){
                Modal.error({
                    content: res.msg,
                  });
            }else{
                Modal.success({
                    content: '修改信息成功！',
                  });
            }
        }).catch((err)=>{
            Modal.error({
                content: err,
              });
        })
    }

    return <>
        <Row style={{marginTop:"5vh"}} justify="center" gutter={[8, 8]}>
            <Col span={4}>学号：</Col>
            <Col span={16}><Input value={usr} disabled></Input></Col>
        </Row>
        <Row justify="center" gutter={[8, 8]}>
            <Col span={4}>姓名：</Col>
            <Col span={16}><Input value={name} onChange={(e)=>setName(e.target.value)}></Input></Col>
        </Row>
        <Row justify="center" gutter={[8, 8]}>
            <Col span={4}>班级名称</Col>
            <Col span={16}><Input value={class_by_name} onChange={(e)=>setClass_by_name(e.target.value)} ></Input></Col>
        </Row>
        <Row justify="center" gutter={[8, 8]}>
            <Col span={4}>班级编号</Col>
            <Col span={16}><Input value={class_by_no} onChange={(e)=>setClass_by_no(e.target.value)} ></Input></Col>
        </Row>
        {
                usr?
                    <Row justify="center" gutter={[8, 8]}>
                        <Col><Button size="large" type="primary" onClick={updatePwd}>修改密码</Button></Col>
                        <Col>
                            <Button hidden={isAdmin} size="large" type="primary" onClick={()=>{
                                confirm({
                                    title:'确认退出登录吗？',
                                    icon:<ExclamationCircleOutlined />,
                                    content:'请确认所有的修改都保存后再退出',
                                    okText:"我已保存",
                                    onOk(){
                                        window.location.href="/login"
                                    }
                                })
                            }}>退出登录</Button>
                            <Button hidden={!isAdmin} size="large" type="primary" onClick={()=>{
                                window.close()
                                window.history.back(-1)
                            }}>关闭页面</Button>
                        </Col>
                    </Row>
                    :
                    <Row justify="center" gutter={[8, 8]}>
                        <Col><Button size="large" type="primary" onClick={()=>{window.location.href="/login"}}>登录</Button></Col>
                    </Row>
        }
        <Row justify="center" gutter={[8, 8]}>
            <Col span={20}><Divider /></Col>
            <Col >以下两项填写时，用换行表示一个职位（荣誉）的填写完成</Col>
        </Row>
        <Row justify="center" gutter={[8, 8]}>
            <Col span={4}>担任职位</Col>
            <Col span={16}><TextArea maxLength={2000} rows={7} value={stu_pos} onChange={(e)=>setStu_pos(e.target.value)}></TextArea></Col>
        </Row>
        <Row justify="center" gutter={[8, 8]}>
            <Col span={4}>所获荣誉</Col>
            <Col span={16}><TextArea maxLength={2000} rows={15} value={prize} onChange={(e)=>setPrize(e.target.value)} ></TextArea></Col>
        </Row>
        <Divider />
        <Row style={{marginBottom:"10vh"}} justify="center">
            {/* reset 按钮 */}
            <Col span={8}><Button type="default" onClick={()=>{
                confirm({
                    title:'确认重置吗？',
                    icon:<ExclamationCircleOutlined />,
                    content:'你的修改将不被保存',
                    onOk(){
                        window.location.reload() 
                    }
                })
                }}>重置填写</Button></Col>
            <Col span={12}><Button type="primary" style={{width:"50vw"}} onClick={()=>{
                confirm({
                    title:'确认提交修改吗？',
                    icon:<ExclamationCircleOutlined />,
                    content:'你的修改将会保存至云端',
                    onOk(){
                        handleClick()
                    }
                })
            }}>保存修改</Button></Col>
        </Row>
    </>
}


export default Info