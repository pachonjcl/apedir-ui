import React from "react";
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import App from './App';
import Home from './Home';
import Purchase from './Purchase';

class WrapperApp extends React.Component {

  render() {
    return (
      {/*<App {...this.props}>*/}
        <Switch>
          <Route path="/home" component={Home} />
          <Route exact path="/purchases/:id" component={Purchase} />
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </Switch>
      {/*</App>*/}
    );
  }

}

export default WrapperApp;
