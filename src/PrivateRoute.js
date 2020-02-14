import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import ApeNavbar from './ApeNavbar';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('token')
            ? (<div><ApeNavbar/> <Component {...props} /></div>)
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)

export default PrivateRoute;