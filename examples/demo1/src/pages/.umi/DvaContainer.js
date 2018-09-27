import { Component } from 'react';
import dva from 'dva';
import createLoading from 'dva-loading';

let app = dva({
  history: window.g_history,
  ...((require('/Users/odooht/Downloads/odoo1/odooht/myapp/dva-odoo/examples/demo1/src/dva.js').config || (() => ({})))()),
});

window.g_app = app;
app.use(createLoading());

app.model({ namespace: 'odooData', ...(require('/Users/odooht/Downloads/odoo1/odooht/myapp/dva-odoo/examples/demo1/src/models/odooData.js').default) });
app.model({ namespace: 'odooLogin', ...(require('/Users/odooht/Downloads/odoo1/odooht/myapp/dva-odoo/examples/demo1/src/models/odooLogin.js').default) });
app.model({ namespace: 'contact', ...(require('/Users/odooht/Downloads/odoo1/odooht/myapp/dva-odoo/examples/demo1/src/pages/Contact/models/contact.js').default) });

class DvaContainer extends Component {
  render() {
    app.router(() => this.props.children);
    return app.start()();
  }
}

export default DvaContainer;
