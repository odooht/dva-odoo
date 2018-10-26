import dvaOdoo from '../../odoo/dva-odoo'

import service from '@/services/odooService';

const ss = dvaOdoo({
  inherit: 'login',
  service,
});

console.log(ss)

export default ss
