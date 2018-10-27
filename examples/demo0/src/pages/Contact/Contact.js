import router from 'umi/router';
import styles from './Contact.css';

import React, { Component } from 'react';

import { connect } from 'dva';

import { Input } from 'antd';
import { lookup } from '@/utils/tools';

export default function() {
  return (
    <div className={styles.normal}>
      <h1>Page Contact</h1>
      <button
        onClick={() => {
          router.goBack();
        }}
      >
        go back
      </button>

      <Bridge />
    </div>
  );
}
const Search = Input.Search;

const ActionModel = 'contact';

@connect(({ login, odooData, contact, resUsers }) => ({ login, odooData, contact, resUsers }))
class Bridge extends Component {
  state = {
    users: { a: 1 },
    status: {},
    board_id: 0,
  };

  test = value => {
    const v2 = value ? value : 'admin,123';
    const [user, age] = v2.split(',');
    const { users } = this.state;
    this.setState({ users: { ...users, [user]: age } });
  };

  componentDidMount() {}

  login = value => {
    //const v = 'admin,123'
    const v = 'A23,123'
    const v2 = value ? value : v;
    const [user, password] = v2.split(',');

    const { dispatch } = this.props;

    console.log('login: params:', { login: user, password, type: 'account' })

    dispatch({
      type: 'login/login',
      payload: { login: user, password, type: 'account' }
    }).then(res => {
      console.log('login: res:', this.props.login )

      const {uid} = this.props.login;
      if(uid){
        this.getUser(uid)
      }
    })
  };

  getUser = (id) => {
    const { dispatch } = this.props;
    console.log('00',this.props.odooData['res.users'])

    dispatch({
      type: 'resUsers/read', payload: { id }
    }).then(res => {

      console.log('user',this.props.odooData['res.users'])

      const odooData = this.props.odooData;
      const me = lookup(id, odooData['res.users'] )

      if (me.done_table_ids){
        this.getTable(me.done_table_ids)
      }
    })
  };

  getTable = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ogTable/read', payload: { id }
    }).then(res => {
      const odooData = this.props.odooData;
      console.log('tbl ok',this.props.odooData)
      console.log('tbl:',this.props.odooData['og.table'])


      console.log('table:',id,odooData)
      const tables = lookup( id, odooData['og.table'] )


      if (!tables){
        return
      }

      if (!tables[0]){
        return
      }

      const board_ids = tables[0].board_ids
      const board_id = tables[0].board_id[0]
      this.setState({ board_id});

      this.getMyTableBoard(board_ids)
    })
  };

  getMyTableBoard = (id) => {
    const { dispatch } = this.props;
    dispatch({ type: 'ogBoard/read', payload: { id }
    }).then(res=>{
      console.log('bd ok',this.props.odooData)
      console.log('bd:',this.props.odooData['og.board'])
    })
    ;

  };

  writeResult = (value) => {
    const { dispatch } = this.props;
    const { board_id } = this.state;

    const v2 = value ? value : 'S,3Hx,SA,2'

    if( ! value ){
      //return
    }

    const [declarer, contract, openlead, result0] = v2.split(',');
    const result = parseInt(result0)

    console.log(value)

    dispatch({
      type: 'ogBoard/writeResult',
      payload: { id:board_id,declarer, contract, openlead,result}
    });
  };


  query = value => {
    const id = parseInt(value);
    const { dispatch } = this.props;
    dispatch({ type: ActionModel + '/queryBySmallId', payload: { id } });
  };

  view = value => {
    const id = parseInt(value);
    const { dispatch } = this.props;
    dispatch({ type: ActionModel + '/view', payload: { id } });
  };

  add = value => {
    const { dispatch } = this.props;
    dispatch({ type: ActionModel + '/nameCreate', payload: { name: value } });
  };

  findOrCreate = value => {
    const { dispatch } = this.props;
    dispatch({ type: ActionModel + '/findOrCreate', payload: { email: value } });
  };

  rename = value => {
    const name = value;
    const { id } = this.props[ActionModel];
    const { dispatch } = this.props;
    dispatch({ type: ActionModel + '/rename', payload: { id, name } });
    //dispatch({ type: ActionModel + '/write', payload: { id, vals: { name } } });
  };

  del = value => {
    const id = parseInt(value);
    const { dispatch } = this.props;
    dispatch({ type: ActionModel + '/unlink', payload: { id } });
  };

  render() {
    const { ids, id } = this.props.contact;

    const login = this.props.login;
    const partners = this.props.odooData['res.partner'];

    const contacts = lookup(ids, partners);
    const contact = lookup(id, partners);

    console.log('********render*******', this.props.odooData )

    return (
      <div>
        <div>
          test:
          {JSON.stringify(this.state)}
        </div>
        <Search
          placeholder=""
          enterButton="Test"
          //size="large"
          onSearch={value => this.test(value)}
        />

        <Search
          placeholder="user, password"
          enterButton="Login"
          //size="large"
          onSearch={value => this.login(value)}
        />
        <Search
          placeholder="declarer, contract, openlead,result"
          enterButton="writeResult"
          //size="large"
          onSearch={value => this.writeResult(value)}
        />
        <Search
          placeholder="domain"
          enterButton="query"
          //size="large"
          onSearch={value => this.query(value)}
        />
        <Search
          placeholder="id to view"
          enterButton="View"
          //size="large"
          onSearch={value => this.view(value)}
        />

        <Search
          placeholder="name to add"
          enterButton="Add"
          //size="large"
          onSearch={value => this.add(value)}
        />

        <Search
          placeholder="email"
          enterButton="findOrCreate"
          //size="large"
          onSearch={value => this.findOrCreate(value)}
        />

        <Search
          placeholder="new name"
          enterButton="rename"
          //size="large"
          onSearch={value => this.rename(value)}
        />
        <Search
          placeholder="id to del"
          enterButton="Del"
          //size="large"
          onSearch={value => this.del(value)}
        />

        <div>
          odoo:
          {JSON.stringify( Object.keys( this.props.odooData) )}
          {JSON.stringify(this.props.odooData)}
        </div>
        <div>
          login:
          {JSON.stringify(login)}
        </div>
        <div>
          id:
          {JSON.stringify(id)}
        </div>
        <div>
          ids:
          {JSON.stringify(ids)}
        </div>
        <div>contact:</div>
        <div>
          contact:
          {JSON.stringify(contact)}
        </div>
        <div>contacts:</div>
        <ul>
          {contacts.map((contact, i) => (
            <li key={i}>{JSON.stringify(contact)}</li>
          ))}
        </ul>

        <div>partners:</div>
        <div>
          partners:
          {JSON.stringify(partners)}
        </div>
      </div>
    );
  }
}
