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
import dvaOdoo from './dva-odoo-mock';

//TBD: dynamic import all file in mock path
//import user from './user'
//import game from './game'
import contact from './contact';
import login from './login';
// 2018-9-18

const mockData = {
  contact: contact(),
  login: login(),
};

const proxy = {
  'POST /api/json/api': dvaOdoo(mockData).call,
  'POST /api/json/user/login': dvaOdoo(mockData).login,
};

export default delay(proxy, 200);
