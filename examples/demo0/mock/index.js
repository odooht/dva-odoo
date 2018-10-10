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

import dvaOdooMock from './dva-odoo-mock';
import dvaOdooMockCrm from './dva-odoo-mock-crm';

//TBD: dynamic import all file in mock path
import contact from './contact';
import login from './login';
// 2018-9-18

const mockData = {
  contact: contact(),
  login: login(),
  inherits: { ...dvaOdooMockCrm },
};

const proxy = {
  'POST /api/json/api': dvaOdooMock(mockData).call,
  'POST /api/json/user/login': dvaOdooMock(mockData).login,
};

export default delay(proxy, 200);
