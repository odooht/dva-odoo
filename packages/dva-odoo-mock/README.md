dva-odoo-mock

对应 dva-odoo 的 mock 组件  

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
    inherit: 'res.partner',
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

在 mock 文件夹下定义文件 index.js

```
import { delay } from 'roadhog-api-doc';
import dvaOdooMock from 'dva-odoo-mock';

import contact from './contact';
import login from './login';


const mockData = {
  /* key must dva model name */
  contact: contact(),
  login: login(),
};

const proxy = {
  'POST /api/json/api': dvaOdooMock(mockData).call,
  'POST /api/json/user/login': dvaOdooMock(mockData).login,
};

export default delay(proxy, 200);
```


