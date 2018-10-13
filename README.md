# dva-odoo 和 dva-odoo-mock

* 包括 dva-odoo, dva-odoo-mock 
* 以及 dva-odoo-crm, dva-odoo-mock-crm 演示如何扩展

* dva-odoo 生成 dva model
* dva-odoo-mock 模拟数据接口
* dva-odoo-crm 扩展的 crm 模块
* dva-odoo-mock-crm 对 扩展 crm 模块的模拟数据

## dva-odoo

### 两个特殊的模型

dva-odoo 内置两个特别用途的模型, odooData 和 login, 
生成模型时, 指定 inherit 参数即可 

---

### 已经定义的模型模版

dva-odoo 不断完善成长中, 逐步定义扩展多个模型模版.
通过指定 inherit, 即指定来模型模版名称.
已经定义的模型模版有:
+ 'base': 定义通用的 odoo method, 如: search/read/write/create/unlink/nameCraete
+ 'res.partner': 是对应 odoo model 'res.partner', 定义模型专属 method, 如: findOrCreate

  
+ 基本模型 metaModel, 实现 CRUD 方法, 对应 odoo models 中的 baseModel
+ 常规模型, 对应 odoo 中的各个具体模型, 实现各模型自己的 方法

---
### 模型继承机制
1. 所有模型是单线继承, 只有一个 parent
2. 

### 模型的结构
1. 包含一个 dva 模型, 内置若干 effects 及 reducers 方法
2. 包含一个 odoo 模型, 内置若干 api
3. dva 模型的方法会调用 odoo 模型的 api
4. odoo 模型的 api, 最后是调用 service
5. 模型对外的呈现形式是 dva 模型

### 创建模型时的参数
1. model:     对应的 odoo 模型的名称, 如 res.partner
2. inherit:   被继承的 模型的名称
3. namespace: 指定的 dva 模型的名称
4. service:   访问 odoo 的 service 接口
5. odooApi:   自定义的 api 扩展部分
6. dvaModel:  自定义的 dva 模型扩展部分
7. fields:{default,many2one,one2many}:  模型的字段定义, 对象类型

```
fields:{
  default:['name','title','category_id'],
  many2one: {
    title:{
      model: 'res.partner.title',
      namespace: 'res.partner.title',
      domain: [],
      fields: {default:['name']}
    }
  }
  one2many: {
    category_id:{
      model: 'res.partner.category',
      namespace: 'res.partner.category',
      domain: [],
      fields: {default:['name']}
    }
  }
}
```
8. 以下 9-16 条是对上述第7条 fields 的解释 
9. default: 数组类型, read 时, 默认的字段参数
10. many2one: 对象类型, key 为多对一字段名, value 为二次访问请求时需要的参数
11. one2many: 对象类型, key 为一对多或着多对多字段名, value 为二次访问请求时需要的参数
12. model: 承上, 多对一/一对多,/多对多字段, 对应的 odoo 模型
13. namespace: 承上,  多对一/一对多/多对多字段, 对应的 dva model namespace, 通常与 model 相同
14. fields: 承上,  多对一/一对多/多对多字段, 读取时, fields 定义,
15. 目前, 不实现 fields 的再次级联, 再次实现 many2one, one2many
16. domain: 在进行编辑新增功能, 多对一字段候选取值的过滤条件



### 基础模型 
1. 名称为 base, 被继承时给 inherit 赋值 'base'
2. 内置常用的 odoo api, 包括 search, read, write, create, unlink, nameCraete
3. 这些 api 对应 odoo 中的 odoo.models.BaseModel 中的各个方法
4. 每个 api 有一个 mock 名称, 对应 dva-odoo-mock 中的方法
5. dva 模型内置几个标准方法, 通过 odoo api 获取数据, 并更新 odooData 及自己的 state

### 标准模型
1. 标准模型对应 odoo 中的模型
2. 继承自基础模型, inherits: 'base'
3. 必须有对应的 odoo 模型, model: 'res.partner'
4. 必须有自己的名称, 与 odoo 模型名称相同
5. 自定义的 api 是 odoo 各模型中的自定义方法
6. 每个 api 有一个 mock 名称, 对应 dva-odoo-mock 中的方法
6. 自定义的 dva 模型, 扩展的 effects 对应 自己的 api
7. dva-odoo 的标准模型, 与所有的 odoo 中的模型, 一一对应.
8. dva-odoo 的标准模型, 逐步完善中

### 扩展模型
1. 扩展模型不在 dva-odoo 中, 而在 dva-odoo-xxx 这样的第三方扩展模块中
2. 扩展模型继承自 dva-odoo 中的标准模型. inherit: 'res.partner'
3. 是否可以继承自其他扩展模型, 以后待定, 现在不可以.
4. 模型名称, 在标准模型的基础上扩展, 'res.partner-contact'
5. 模型名称, 不能与标准模型名称重名, 用 '-' 做名称的连接符, 确保不与标准模型名称重名
6. 来自不同的第三方扩展模块, 如 dva-odoo-xxx 与 dva-odoo-yyy 中的扩展模型, 
   若在一个项目中使用, 模型名不能重名
7. 不需要指定 odoo 模型名称, 因为继承自的标准模型中已有定义
8. 自定义的 api 是在调用标准模型的 api 的基础上的一个重写或扩展
9. 自定义的 api 可以定义 mock 名称, 也可以使用标准模型的 mock 名称
10. 自定义的 api 如果是多个异步方法的组合, 则每个异步方法 都需要单独定义一个 mock 名称
11. 自定义的 dva 模型扩展中, 可以重写或扩展 effects 和 reducers 

### 应用模型
1. 应用模型是项目中的模型
2. 可以继承自标准模型, 也可以继承自扩展模型
3. 没有名称, 确定没有名称
4. 必须定义 namespace, 且在自己的项目中唯一
5. 可以重写或扩展 api
6. 自定义的 api 可以定义 mock 名称, 也可以使用标准模型的 mock 名称
7. 自定义的 api 如果是多个异步方法的组合, 则每个异步方法 都需要单独定义一个 mock 名称
8. 可以重写或扩展 dva 模型中的 effects 方法


 
---
## dva-odoo-mock


---
# dva-odoo 扩展机制

扩展命名方法: dva-odoo-xxx , 如 dva-odoo-crm

dva-odoo 扩展包括两种情况, 
1. 自定义的 odoo 非官方模块, 不包含在 dva-odoo 中
2. 重写 search 方法, 增加过滤条件, 如: res.partner.contact,  
   
```   
   domain= ['type', '=', 'contact']
```

## dva-odoo-crm

## dva-odoo-mock-crm




##  TBD

---
metaModel 的 reducers 方法需要check重构
put odooData/update 不易于理解
重新定义几个 effect 处理 odooData/update
ids 的几种更新场景: replace, remove, insert, append
search --> replace
unlink --> remove
create --> insert first
write  --> nothing do


## 测试
* dva-odoo, dva-odoo-mock, dva-odoo-crm, dva-odoo-mock-crm 一起测试
* 导入 dva, 在 dva 架构下进行测试
* 定义 mock 接口, proxy
* 定义 service, 并将 proxy 作为 service 的一个参数
* 定义 login 和 odooData 模型
* 定义一个 普通模型
* 测试 dva-odoo 的 metaModel 中的 各个方法
* 测试 dva-odoo 的扩展模型的各个方法
* 测试 dva-odoo-crm 中的方法
* 因 proxy 做桥, 最后会测试打牌 dva-odoo-mock 和 dva-odoo-mock-crm

---

## 开发日志:

* 2018-10-11 更新 login api
* 2018-10-10 many2one, one2many 字段的处理
* 2018-10-8 更新 login 模型
* 2018-10-7 在 npm 上发布 dva-odoo, dva-odoo-mock, dva-odoo-crm, dva-odoo-mock-crm
* 2018-10-7 demo1 重写
* 2018-10-6 抽象出 model 的概念, odooApi 隶属于某个模型
* 2018-10-5 重构 dva-odoo 的接口
* 2018-10-4 重新拆分出 odooApi, 以实现异步方法.
* 2018-10-3 重构 dva-odoo-mock
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

