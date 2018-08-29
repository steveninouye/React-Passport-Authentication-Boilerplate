// takes client to login in page if isn't logged in
// also saves where the client is trying to go

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isLoggedIn } from '../../services/user';

const PrivateRoute = (props) => {
    const Component = props.component;
    const propsToPass = Object.assign({}, props);
    delete propsToPass.component;

    return (
        <Route {...propsToPass} render={props => (
            isLoggedIn() ? (
                <Component {...props} />
            ) : (
                <Redirect to={{
                    pathname: '/login',

                    // this is given to the login component so that it knows where it came from
                    // reference: https://reacttraining.com/react-router/web/api/Redirect/to-object
                    // refer to first line in render method on login component.  *Code shown on the next line below here*
                    // const { from } = this.props.location.state || { from: { pathname: '/' } };
                    state: { from: props.location } 
                }} />
            )
        )} />
    );
};

export default PrivateRoute;