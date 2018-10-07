dva-odoo-mock

对应 dva-odoo 的 mock 组件  
  

Models

* res.partner
* res.users   TBD
* TBD

在 mock 夹下建立文件index.js
```
const contact = {
  records = {1:{id:1}, 2:{id:2}},
  inherit: 'res.partner',
  extend: [(records)=>{
    return {
      newMethod: ()=>{
        return 1
      }
    }
  }]
};

login = {
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


import dvaOdooMock from 'dva-odoo-mock'

const mockData = {
    contact,
    login,
};

const mockService = dvaOdooMock(mockData);
const proxy = {
    'POST /api/json/api': mockService.call,
    'POST /api/json/user/login': mockService.login,
};

// TBD delay()
export proxy;

```

