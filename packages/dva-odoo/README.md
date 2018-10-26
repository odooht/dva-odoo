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
  const {
    model, namespace, odooCall, api, 
    fields:{ default=['name'] } 
  } = options
  
  
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
  fields:{
    default:  ['name'],
    many2one: {
      title:{
        model: 'res.partner.title',
        namespace: 'res.partner.title',
        domain:[],
        fields:{default:[name]}
      }
    },

    one2many: {
      category_id:{
        model: 'res.partner.category',
        namespace: 'res.partner.category',
        domain:[],
        fields:{default:[name]}
      }
    }

  }
})

```

各参数的作用:
* inherit: 被继承的模版名称
* model: 对应 odoo 的模型名称, 如果 inherit == 'base', 为必传
* namespace: 必传参数 dva model 名称
* service: 访问 odoo 服务的接口
* odooApi:  自定义的 api 扩展部分
* dvaModel: 自定义的 dva model 扩展部分
* fields

