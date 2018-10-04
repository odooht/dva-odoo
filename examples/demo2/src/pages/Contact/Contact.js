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

@connect(({ login, odooData, contact }) => ({ login, odooData, contact }))
class Bridge extends Component {
  state = {
    users: { a: 1 },
    status: {},
  };

  test = value => {
    const v2 = value ? value : 'admin,123';
    const [user, age] = v2.split(',');
    const { users } = this.state;
    this.setState({ users: { ...users, [user]: age } });
  };

  componentDidMount() {}

  login = value => {
    const v2 = value ? value : 'admin,123';
    const [user, password] = v2.split(',');

    const { dispatch } = this.props;
    dispatch({
      type: 'login/login',
      payload: { login: user, password, type: 'account' },
      callback: data => {
        this.setState({ data });
      },
      error: data => {
        this.setState({ data });
      },
      success: data => {
        this.setState({ data });
      },
    });
  };

  query = value => {
    const id = parseInt(value);
    const { dispatch } = this.props;
    dispatch({ type: ActionModel + '/queryBySmallId', payload: { id: id ? id : 0 } });
  };

  view = value => {
    const id = parseInt(value);
    const { dispatch } = this.props;
    dispatch({ type: ActionModel + '/view', payload: { id } });
  };

  add = value => {
    const { dispatch } = this.props;
    dispatch({ type: ActionModel + '/createByName', payload: { name: value } });
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
  };

  del = value => {
    const id = parseInt(value);
    const { dispatch } = this.props;
    dispatch({ type: ActionModel + '/del', payload: { id } });
    dispatch({ type: ActionModel + '/sss', payload: { id } });
  };

  render() {
    const { ids, id } = this.props.contact;

    console.log('this.props.contact=', this.props.contact);

    const login = this.props.login;
    const { res_partner, res_users } = this.props.odooData;
    const partners = { ...res_partner };
    const odooUsers = { ...res_users };

    const contacts = lookup(ids, partners);
    const contact = lookup(id, partners);

    console.log('this.props.odooData=', this.props.odooData);
    console.log('contacts = lookup(ids, this.props.odooData.res_partner): ', contacts);

    //    console.log('********render*******', this.props.odoo_data )

    return (
      <div>
        <div>
          test:
          {JSON.stringify(this.state)}
        </div>
        <Search
          placeholder=""
          enterButton="Test"
          size="large"
          onSearch={value => this.test(value)}
        />

        <Search
          placeholder="user, password"
          enterButton="Login"
          size="large"
          onSearch={value => this.login(value)}
        />
        <Search
          placeholder="domain"
          enterButton="query"
          size="large"
          onSearch={value => this.query(value)}
        />
        <Search
          placeholder="id to view"
          enterButton="View"
          size="large"
          onSearch={value => this.view(value)}
        />

        <Search
          placeholder="name to add"
          enterButton="Add"
          size="large"
          onSearch={value => this.add(value)}
        />

        <Search
          placeholder="email"
          enterButton="findOrCreate"
          size="large"
          onSearch={value => this.findOrCreate(value)}
        />

        <Search
          placeholder="new name"
          enterButton="rename"
          size="large"
          onSearch={value => this.rename(value)}
        />
        <Search
          placeholder="id to del"
          enterButton="Del"
          size="large"
          onSearch={value => this.del(value)}
        />

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
        <div>
          odoo:
          {JSON.stringify(this.props.odooData)}
        </div>
        <div>
          users:
          {JSON.stringify(odooUsers)}
        </div>
      </div>
    );
  }
}
