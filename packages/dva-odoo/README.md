

## 测试
* 测试 metaModel 需要自己定义一个 service, 并通过 mock 参数传递模拟信息
* 测试 odooData 需要自己定义一个 service, 并通过 mock 参数传递模拟信息

---

## 开发日志:

* 2018-10-6 dva-odoo 重构接口
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
