import service from '@/services/odooService';
import dvaOdoo from './dva-odoo';
import dvaOdooGame from './igame'

const models = {
  resUsers: { default: [
    'name', 'login', 'todo_table_ids','done_table_ids'
  ]},

  ogGame: { default: [
    'name','group_ids','round_ids','team_ids','deal_ids'
  ]},

  ogGameGroup:{ default: [
    'name','game_id','team_ids'
  ]},

  ogGameRound:{ default: [
    'name','number','game_id',
    'date_from','date_thru','team_info_ids',
    'deal_ids','match_ids'
  ]},

  ogDeal:{ default: [
    'name','number','card_str','game_id','round_id',
    'dealer','vulnerable',
    'card_ids','board_ids'
  ]},

  ogGameTeam: { default: [
    'name','number','game_id','group_id','player_ids',
    'round_info_ids',
    'score','score_manual','score_uom'
  ]},

  ogGameTeamPlayer: { default: [
    'name','team_id','role'
  ]},

  ogGameTeamRoundInfo:{ default: [
    'name','team_id','game_id','group_id','round_id',
    'match_id',
    'score','score_manual','score_uom'
  ]},

  ogMatch:{ default: [
    'name','number','game_id','round_id','group_id',
    'host_id','guest_id','match_team_ids',
    'table_ids','open_table_id','close_table_id',
    'line_ids',
    'host_imp','guest_imp','imp_manual',
    'host_vp','guest_vp','vp_manual'
  ]},

  ogMatchTeam:{ default: [
    'name','match_id','team_id','position','vp'
  ]},

  ogMatchLine:{ default: [
    'name','match_id','deal_id','host_id','guest_id',
    'open_table_id','close_table_id',
    'open_board_id','close_board_id',
    'open_declarer', 'open_contract', 'open_result', 'open_point', 'open_ns_point', 'open_ew_point','host_imp',
    'close_declarer','close_contract','close_result','close_point','close_ns_point','close_ew_point','guest_imp'
  ]},

  ogTable:{ default: [
    'name','number','room_type','match_id','game_id','round_id',
    'date_from','date_thru','deal_ids', 'board_ids','board_id',
    'ns_team_id','ew_team_id','table_player_ids','player_ids',
    'east_id','west_id','north_id','south_id',
  ]},

  ogTablePlayer:{ default: [
    'name','table_id','player_id','position',
    'match_id','team_id',
  ]},

  ogBoard:{ default: [
    'name','deal_id',
    'number','vulnerable','dealer','hands',
    'declarer', 'contract', 'openlead','result','ns_point','ew_point',
    'auction', 'tricks', 'last_trick', 'current_trick',
    'ns_win','ew_win', 'player', 'state'
  ]}

}

export default (options) => {

  const { model } = options

  const namespace0 = model.split('.').map(
    item => item.substring(0,1).toUpperCase() + item.substring(1)
  ).join('')

  const namespace = namespace0.substring(0,1).toLowerCase(
      ) + namespace0.substring(1)

  const inherit = model
  return dvaOdoo(dvaOdooGame({
    ...options, namespace, model, inherit, service,
    fields: models[namespace]
  }));

}
