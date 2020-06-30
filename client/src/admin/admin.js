import React, { useState,useEffect,useReducer } from 'react';
import 'antd/dist/antd.css';
import './admin.css'
import { Input,Button,Row,Col,Modal,Select,Divider,Tag,Table  } from 'antd';
import { UserOutlined,KeyOutlined } from '@ant-design/icons';
const { Option } = Select;
const { confirm } = Modal;
const axios = require('axios')
const ip=require('../config').server_ip

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem('token');

function Admin(){
    const [searchList,setSearchList]=useReducer((state,method)=>{
        //method:{key,val}
        let tp={}
        for(let e in state)tp[e]=state[e]
        tp[method.key]=method.val
        return tp
    },{})

    const [chooseList,setChooseList]=useState([])
    const [canExecChoose,setCanExecChoose]=useState(true)

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
                axios.post(ip+"/pwd",{usr:"admin",pwd:a}).then((res)=>{
                    res=res.data
                    if(res.stat==0){
                        Modal.success({content:"修改成功！"})
                    }else Modal.error({content:res.msg})
                }).catch((err)=>Modal.error({content:err.toString()}))
            }
        })
    }

    function addUsr(){
        let usr=prompt("输入要增加的学号","")
        if(!usr)return
        axios.post(ip+"/addUsr",{usr:usr}).then((res)=>{
            res=res.data
            if(res.stat==0)Modal.success({content:"增加账户成功"})
            else Modal.error({content:res.msg})
        }).catch(err=>Modal.err({content:err}))
    }

    function delUsr(){
        let usr=prompt("输入要删除的学号","")
        if(!usr)return
        axios.post(ip+"/delUsr",{usr:usr}).then((res)=>{
            res=res.data
            if(res.stat==0)Modal.success({content:"删除账户成功"})
            else Modal.error({content:res.msg})
        }).catch(err=>Modal.err({content:err}))
    }

    function choose(){
        setCanExecChoose(false)
        axios.post(ip+"/search",searchList).then((res)=>{
            res=res.data
            if(res.stat===0){
                //增加key属性后传给表格处理
                setChooseList(res.list.map((v,i)=>{
                    v.usr=<a href={"/info?usr="+v.usr} target="view_window">{v.usr}</a>
                    v.key=i;
                    return v;
                }))
            }
            else Modal.error({content:res.msg})
            setCanExecChoose(true)
        }).catch((err)=>{
            Modal.error({content:err.toString()})
            setCanExecChoose(true)
        })
    }

    return <div style={{margin:"5vh 5vw"}}>
        <Divider orientation="center">账户管理</Divider>
        <Row justify="center" gutter={[8, 8]}>
            <Col><Button onClick={()=>window.location.href="/login"}>重新登录</Button></Col>
            <Col><Button onClick={updatePwd}>修改密码</Button></Col>
            <Col><Button onClick={addUsr}>添加账户</Button></Col>
            <Col><Button onClick={delUsr}>删除账户</Button></Col>
        </Row>
        <Divider orientation="center">匹配字段规则：RegExp <a href="https://www.jianshu.com/p/e25c4cfc8f4e" target="view_window">了解更多</a></Divider>
        <Row justify="center" gutter={[8, 8]}>
            <Col><SearchModel sel="usr" updateList={setSearchList}/></Col>
        </Row>
        <Row justify="center" gutter={[8, 8]}>
            <Col><SearchModel sel="name" updateList={setSearchList}/></Col>
        </Row>
        <Row justify="center" gutter={[8, 8]}>
            <Col><SearchModel sel="class_by_no" updateList={setSearchList}/></Col>
        </Row>
        <Row justify="center" gutter={[8,8]}>
            <Col>选择筛选的字段：</Col>
            <Board searchList={searchList} />
        </Row>
        <Row justify="center" gutter={[8, 8]}>
            <Col><Button loading={!canExecChoose} onClick={choose} type="primary" style={{width:"250px"}}>筛选</Button></Col>
        </Row>
        <Row justify="center" gutter={[8, 8]}>
            <Col><Divider dashed>筛选结果</Divider></Col>
        </Row>
        <ResultGrid list={chooseList} />
    </div>
}

function ResultGrid(props){//props.list
    console.log(props.list)
    const columns=[
        {title:'学号',dataIndex:'usr',key:'usr',},
        {title:'姓名',dataIndex:'name',key:'name',},
        {title:'班级(名称)',dataIndex:'class_by_name',key:'class_by_name',},
        {title:'班级(序号)',dataIndex:'class_by_no',key:'class_by_no',},

    ]
    return <Table dataSource={props.list} columns={columns} />
}

function Board(props){
    let arr=[]
    const colorList=["#108ee9","#87d068","#2db7f5","#f50"]
    for(let e in props.searchList){
        if(props.searchList[e])
            arr.push(<Tag color={colorList[Math.floor(Math.random()*colorList.length)]}>{e+":"+props.searchList[e]}</Tag>)
    }
    return arr.length?arr.map(v=><Col>{v}</Col>):"暂无筛选项"
}

function SearchModel(props){
    const [key,setKey]=useState(props.sel)
    const [val,setVal]=useState('')
    const selectBefore = (
        <Select value={key} className="select-before" onChange={(value)=>{
            setKey(value);
            props.updateList({key:key,val:''})
            props.updateList({key:value,val:val})
        }}>
          <Option value="usr">学    号</Option>
          <Option value="name">姓   名</Option>
          <Option value="class_by_no">班级序号</Option>
          <Option value="stu_pos">工作职位</Option>
          <Option value="prize">奖  项</Option>
        </Select>
      );
      function handleChange(e){
        setVal(e.target.value)
        props.updateList({key:key,val:e.target.value})
      }
    return (<>
        <Input addonBefore={selectBefore} value={val} onChange={handleChange} placeholder="留空则不筛选该字段" />
    </>)
}

export default Admin