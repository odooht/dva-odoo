import dvaOdoo from 'dva-odoo';

import services from '@/services/odooService'

export default dvaOdoo({
  service: services.login,
  inherit:'login',
  extend : {}

})

