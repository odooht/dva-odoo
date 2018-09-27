# dva-odoo

version: 0.1.0

生成 dva model 的一个扩展模块, 预定义一些 dva model 模版, 
这些模版模仿 odoo 的模型, 便于访问 odoo 服务.

odooServices 是.....

## 使用方法

```
import odooServices from '@/services/odooservice'
import dvaodoo from 'dva-odoo'

const a_dva_mode = dvaodoo({
  model: 'res.partner',
  inherit: 'res.partner',
  namespace: 'customer',
  service: odooServices.call,
  extend: [(options)=>{
    const {namespace, model, service} = options
    return {
      namespace: namespace,
      state:{
      },
      
      effect:{
      },
      
      reducers: {
      }
    }
  }]
})

```

各参数的作用:
* inherit: 被继承的模版名称
* model: 对应 odoo 的模型名称
* namespace: 必传参数 dva model 名称
* service: 访问 odoo 服务的接口
* extend: 自定义的 dva model 扩展部分, 注意中括号的作用

## 两个特殊的模型

dva-odoo 内置两个特别用途的模型, odooData 和 login, 
生成模型时, 指定 inherit 参数即可 


---


```
import odooServices from '@/services/odooservice'
import dvaodoo from 'dva-odoo'

const login_dva_mode = dvaodoo({
  inherit: 'login',
  service: odooServices.login,
  extend: {
      state:{
      },
      
      effect:{
      },
      
      reducers: {
      }
    }
})

const odooData_dva_mode = dvaodoo({
  inherit: 'odooData',
  service: odooServices.call,
  extend: {
      state:{
      },
      
      effect:{
      },
      
      reducers: {
      }
    }
})
```


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

假定有这样一个自定义的dva-odoo扩展: dva-odoo-addons-xxx
以下代码演示了 dva-odoo-addons-xxx 和 dva-odoo 一起使用的方法

```
import dvaodoo_addons from 'dva-odoo-addons-xxx'
import dvaodoo from 'dva-odoo'

const a_dva_model_addons = dvaodoo_addons({
  inherit: 'yyy',
  // ...
})

const a_dva_model = dvaodoo(a_dva_model_addons)

```

dva-odoo 扩展包括两种情况, 
1. 自定义的 odoo 非官方模块, 不包含在 dva-odoo 中
2. 重写 search 方法, 增加过滤条件, 如:
   res.partner.contact,  domain= [type = contact]
+ 专用模型, 在常规模型的基础上, 增加过滤条件
 

## 测试
* 测试 metaModel 需要自己定义一个 service, 并通过 mock 参数传递模拟信息
* 测试 odooData 需要自己定义一个 service, 并通过 mock 参数传递模拟信息

---

## 开发日志:

* 2018-9-27 应用项目的测试方案 ok
* 2018-9-26 使用 dva 的开发环境, 搭建开发环境, npm 发布
* 2018-9-25 odooApi 完成历史使命. 代码都集成到 metaModel 中
* 2018-9-24 测试 ok. odooData 测试完成, 仅有 sid 为空时的分支未测到.
* 2018-9-23 定义 dva-odoo 扩展方法, 建议命名格式为 dva-odoo-addons-xxx
* 2018-9-23 优化模型构造方法, 解耦 dva-odoo 和 dva-odoo-addons
* 2018-9-23 基本模型中增加通用的 call 方法. res.partner.contact 中的rename 演示 call 方法的使用
* 2018-9-23 model 无需通过回调实现控制, 可以通过扩展模型方法来搞定
* 2018-9-22 逐步规范代码, 便于在 npm 发布
* 2018-9-20 model 设置回调函数, 便于页面控制. 完成 login 模型的回调函数.
* 2018-9-18 定义 dva-odoo-core, 拆分出 dva-odoo-addons
* 2018-9-17 remove odoorpc from dva-odoo. 这样 dva-odoo 去 odoo 化, 纯粹成为 dva 的扩展. 
* 2018-9-16 设置模型扩展机制. 包括 dva model 和 mock model
* 2018-9-16 明确对外接口, modelCreator, rpcCall, mockModel, mockApi
* 2018-9-15 将 sid 从 odooApi 移出, 放在 model 中.  
* 2018-9-15 在 umi-odoo-demo 中, 整理 dva-odoo 有关代码, 准备独立.
