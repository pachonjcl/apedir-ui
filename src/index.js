import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import './index.css';

import Login from './Login';
import Register from './Register';
import Home from './Home';
import Purchase from './Purchase';
import Profile from './profile/Profile';
import PrivateRoute from './PrivateRoute';
import ProductManagement from './ProductManagement';
import { initializeFirebase, askForPermissionToReceiveNotifications } from './push_notifications';
import serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';

const routing = (
  <Router>
    <div>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <PrivateRoute exact path="/home" component={Home} />
      <PrivateRoute exact path="/purchases/:id" component={Purchase} />
      <PrivateRoute exact path="/profile" component={Profile}/>
      <PrivateRoute exact path="/product-management" component={ProductManagement}/>
    </div>
  </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

initializeFirebase();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker();

if(!localStorage.getItem('notification-token')) {
    askForPermissionToReceiveNotifications();
}