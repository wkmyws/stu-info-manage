> client 端
>
> ```yarn install```
>
> ``` yarn start```
> ``` yarn build```



>
>  server端
>
> 在config.js中修改配置
> 
>  `npm install`
>
>  `node app.js`



> 数据库
> mysql
> database : stu_info
> table : login stu

#### 数据库：nau_info

##### 数据表

+ login

  | name | type         | info                  |
  | ---- | ------------ | --------------------- |
  | usr  | nvarchar(10) | 学号,primary key      |
  | pwd  | nvarchar(15) | 密码,加盐             |
  | type | nvarchar(5)  | stu\|\|admin,标识权限 |

+ stu

  | name          | type           | info                                |
  | ------------- | -------------- | ----------------------------------- |
  | usr           | nvarchar(10)   | 学号，主键                          |
  | name          | nvarchar(20)   | 姓名                                |
  | class_by_name | nvarchar(50)   | 班级名称                            |
  | class_by_no   | nvarchar(20)   | 班级序号                            |
  | stu_pos       | nvarchar(2000) | 学生工作职位 |
  | prize         | nvarchar(2000) | 奖项         |

  ```sql
  create table stu(
  	usr nvarchar(10) primary key,
      name nvarchar(20),
      class_by_name nvarchar(50),
      class_by_no nvarchar(20),
      stu_pos nvarchar(2000),
      prize nvarchar(2000)
  );
  ```

  ```sql
  insert into stu(usr,name,class_by_name,class_by_no,stu_pos,prize)
  values("1810101","name","软工一班","180001","","")
  ```

  

+ 



#### server端路由接口

##### 地址

> localhost:3028

##### /login

+ post

  params

  | name   | info |
  | ------ | ---- |
  | usr    |      |
  | pwd    |      |
  | vrCode |      |

  ret

  | name | info               |
  | ---- | ------------------ |
  | stat | 0 succ<br />1 fail |
  | msg  | string             |





##### /info

+ get

  + params

    token

  + ret

  | name | info                         |
  | ---- | ---------------------------- |
  | stat | 0 succ                       |
  | info | json-data<br />表stu单行信息 |
  | msg  |                              |

+ post

  + params

    token

  + ret

    | name | info |
    | ---- | ---- |
    | stat |      |
    | msg  |      |
    |      |      |



##### /pwd

+ post

  + params

    token

    | name | info         |
    | ---- | ------------ |
    | pwd  | 更新后的密码 |

    

  + ret

    | name | info |
    | ---- | ---- |
    | stat |      |
    | msg  |      |

##### /addUsr

+ post

  params

  token,usr

  + ret stat msg



##### /search

+ post

  params

  token

  | name          | info |
  | ------------- | ---- |
  | usr           |      |
  | name          |      |
  | class_by_name |      |
  | class_by_no   |      |
  | stu_pos       |      |
  | prize         |      |

  + ret

    stat

    msg

    list=[{usr,name,class_by_name,class_by_no},]

##### /register

+ post

  params

  token

  | name   | info |
  | ------ | ---- |
  | usr    |      |
  | pwd    |      |
  | vrCode |      |

  





