/*
   start server with no mock.
   $ yarn start:no-mock

   config in /package.json:

   /package.json#scripts:
   + "start:no-mock": "cross-env MOCK=none umi dev",

   /package.json#devDependencies:
   + "roadhog-api-doc": "^1.1.2",
   + "cross-env": "^5.1.1",

*/

import { delay } from 'roadhog-api-doc';

import dvaOdoo from 'dva-odoo-mock';

import loginModel from './loginModel';

//TBD: dynamic import all file in mock path
import contact from './contact';
//TBD: 2018-9-18

const proxy = {
  'POST /api/json/api': (req, res) => {
    const result = dvaOdoo.mockApi.jsonApi(req.body, {
      contact,
      //.....
    });

    res.send(result);
  },

  'POST /api/json/user/login': (req, res) => {
    const result = dvaOdoo.mockApi.jsonUserLogin(req.body, loginModel.records);
    res.send(result);
  },
};

//export default proxy;

export default delay(proxy, 200);
