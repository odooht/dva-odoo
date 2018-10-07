dva-odoo-mock-crm

对应 dva-odoo-crm 的 mock 组件  
  
参考 dva-odoo-mock 
在 mock 文件夹下定义的文件 contact.js
继承的 'res.partner.contact' 来自 dva-odoo-mock-crm

```
const my_records = {...};

const creator = ({ records }) => {
  return { ... }
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

mock 文件夹下的文件 index.js 修改为:

导入 dvaOdooMockCrm
mockData 增加 inherits: {...dvaOdooMockCrm}

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


