import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'

import store from './redux/store'
import Register from './containers/register'
import Login from './containers/login'
import Main from './containers/main'

import './assets/css/index.less'

// import './test/socketio_test'

ReactDOM.render((
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route path='/register' component={Register} />
        <Route path='/login' component={Login} />
        <Route component={Main} />{/* 默認組件 */}
      </Switch>
    </HashRouter>
  </Provider>
), document.getElementById('root'))