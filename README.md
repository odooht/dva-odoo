# dva-odoo 和 dva-odoo-mock

* 包括 dva-odoo, dva-odoo-mock 
* 以及 dva-odoo-crm, dva-odoo-mock-crm 演示如何扩展

* dva-odoo 生成 dva model
* dva-odoo-mock 模拟数据接口
* dva-odoo-crm 扩展的 crm 模块
* dva-odoo-mock-crm 对 扩展 crm 模块的模拟数据

# dva-odoo

version: 0.2.0

基于 dva 的一个模块, 定义一些访问 odoo 的接口

包括 dva-odoo 和 dva-odoo-mock

# 使用方法

---
在 services 文件夹下建立文件 service.js
其中 '@/utils/request' 是一个 基于 fetch 的异步 web 请求模块
可以从 ant-design-pro 上下载
未来计划将 request 集成到 dva-odoo 中

```
import request from '@/utils/request';

export default {
  call: { url: '/api/json/api', request },
  login: { url: '/api/json/user/login', db: 'TT' },
};
```
---

## 两个特殊的模型

dva-odoo 内置两个特别用途的模型, odooData 和 login, 
生成模型时, 指定 inherit 参数即可 

在 models 文件夹下建立 odooData.js
```
import dvaOdoo from 'dva-odoo'
export default dvaOdoo({
  inherit: 'odooData'
})

```

在 models 文件夹下建立 login.js
```
import dvaOdoo from 'dva-odoo'
import service from '@services/service'
export default dvaOdoo({
  inherit: 'login',
  service,
  extned:{
    effects:{
      *newMethod(){}
    }
  }
})

```

创建一个新 model:

```
import service from '@services/service'
import dvaOdoo from 'dva-odoo'

const odooApi = (options)=> {
  const { model, namespace, fields:fields_default=['name'], odooCall, api } = options
  const foo = async (token, params) =>{
    const res1 = await odooCall(token,params: {model, method, args, kwargs})
    const res2 = await api.read(token,params: {id, fields})
    return ...
  }
  
  const bar = async (token, params) =>{
    /* !!! to connect to dva-odoo-mock */
    const mock_react_api = namespace + '/' + 'bar'
    
    const res1 = await foo(token,params: {...})
    const res2 = await odooCall(token,params: {
      model, method, args, 
      kwargs:{context: mock_react_api}
    })
    
    const res3 = await api.read(token,params: {id, fields})
    return ...
  }
  return {
    foo, bar
  }
}


const dvaModel = ({namespace, model, api }) => {
  return {
    namespace: namespace,
    state:{
    },
      
    effect:{
      *bar: (){
        const response = yield api.bar()
      }
      const {result, error} = response
      if(result){
        yield put(type:'save', payload: {data: result})
      }
    },
      
    reducers: {
    }
  }
}


export default dvaOdoo({
  inherit: 'res.partner',
  namespace: 'contact',
  model: 'res.partner',
  service,
  odooApi,
  dvaModel,
})

```

各参数的作用:
* inherit: 被继承的模版名称
* model: 对应 odoo 的模型名称, 如果 inherit == 'base', 为必传
* namespace: 必传参数 dva model 名称
* service: 访问 odoo 服务的接口
* odooApi:  自定义的 api 扩展部分
* dvaModel: 自定义的 dva model 扩展部分


---

## 已经定义的模型模版

dva-odoo 不断完善成长中, 逐步定义扩展多个模型模版.
通过指定 inherit, 即指定来模型模版名称.
已经定义的模型模版有:
+ 'base': 定义通用的 odoo method, 如: search/read/write/create/unlink/nameCraete
+ 'res.partner': 是对应 odoo model 'res.partner', 定义模型专属 method, 如: findOrCreate

  
+ 基本模型 metaModel, 实现 CRUD 方法, 对应 odoo models 中的 baseModel
+ 常规模型, 对应 odoo 中的各个具体模型, 实现各模型自己的 方法
 
---
## dva-odoo 扩展

假定有这样一个自定义的 dva-odoo 扩展: dva-odoo-xxx
以下代码演示了 dva-odoo-xxx 和 dva-odoo 一起使用的方法

```
import service from '@services/service'
import dvaOdoo from 'dva-odoo'
import dvaOdooCrm from 'dva-odoo-crm'

export default dvaOdoo(dvaOdooCrm({
  inherit: 'res.partner',
  namespace: 'contact',
  model: 'res.partner',
  service,
  odooApi: (options) =>{
    const foo = () => {}
    const bar = () => {}
    return {foo, bar}
  },
  
  dvaModel:(options) =>{
    return {
      namespace,
      effects:{
        *bar(){
        }
      }
    }
  },
}))

```

dva-odoo 扩展包括两种情况, 
1. 自定义的 odoo 非官方模块, 不包含在 dva-odoo 中
2. 重写 search 方法, 增加过滤条件, 如: res.partner.contact,  
   
```   
   domain= ['type', '=', 'contact']
```

---
## dva-odoo-mock

在 mock 文件夹下定义文件 contact.js

```
const my_records = {
  1: { id: 1, name: 'c1', email: '' },
  2: { id: 2, name: 'c2', email: '' },
  3: { id: 3, name: 'c3', email: '' },
  4: { id: 4, name: 'c4', email: '' },
};

const creator = ({ records }) => {
  const foo = (...) => {
      return ...
  }
  
  const bar = (...) => {
      return ...
  }
  
  return { foo, bar }
};

export default () => {
  return {
    records: my_records,
    namespace: contact,
    inherit: 'res.partner.contact',
    extend: [creator],
  };
};

```

在 mock 文件夹下定义文件 login.js

```
const records = {
  admin: {
    login: 'admin',
    password: '123',
    sid: 'sid1',
    name: 'ss1',
    uid: 1,
  },
  user: {
    login: 'user',
    password: '123',
    sid: 'sid2',
    name: 'ss2',
    uid: 2,
  },
};

export default () => {
  return records;
};

```

在 mock 文件夹下定义文件 contact.js

```
import { delay } from 'roadhog-api-doc';
import dvaOdooMock from 'dva-odoo-mock';

import contact from './contact';
import login from './login';

/* contact inherit from res.partner.comtact defined in dvaOdooMockCrm */
import dvaOdooMockCrm from 'dva-odoo-mock-crm';

const mockData = {
  /* key must dva model name */
  contact: contact(),
  login: login(),
  inherits: { ...dvaOdooMockCrm },
};

const proxy = {
  'POST /api/json/api': dvaOdooMock(mockData).call,
  'POST /api/json/user/login': dvaOdooMock(mockData).login,
};

export default delay(proxy, 200);
```

