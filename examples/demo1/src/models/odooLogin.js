import dvaOdoo from '../../odoo/dva-odoo'

//import dvaOdoo from 'dva-odoo';

import service from '@/services/odooService';

export default dvaOdoo({
  inherit: 'login',
  service,
});
