import service from '@/services/odooService';

import dvaOdoo from '@/models/../../odoo/dva-odoo';

export default dvaOdoo({
  model: 'og.match.team',
  namespace: 'matchTeam',
  inherit: 'og.match.team',
  service,
  fields:{ default: [
    'name','match_id','team_id','position','vp'
  ]}
});
