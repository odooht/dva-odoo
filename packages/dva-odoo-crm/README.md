## dva-odoo-addons-crm

演示下 dva-odoo 如何扩展

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
