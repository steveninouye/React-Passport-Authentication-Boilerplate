import React, { Component, Fragment } from 'react';
import * as userService from '../../services/user';
import { Redirect } from 'react-router-dom';
import IndeterminateProgress from '../utilities/indeterminateProgress';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToReferrer: false,
            email: '',
            password: '',
            feedbackMessage: '',
            checkingLogin: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.login = this.login.bind(this);
    }

    componentDidMount() {
        userService.checkLogin()
        .then((loggedIn) => {
            if (loggedIn) {
                this.setState({ redirectToReferrer: true, checkingLogin: false });
            } else {
                this.setState({ checkingLogin: false });
            }
        });
    }

    login(e) {
        e.preventDefault();
        userService.login(this.state.email, this.state.password)
        .then(() => {
            this.setState({ redirectToReferrer: true });
        }).catch((err) => {
            if (err.message) {
                this.setState({ feedbackMessage: err.message });
            }
        });
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {
        // checks from which page where we were directed to the login page from
       const { from } = this.props.location.state || { from: { pathname: '/' } };
       const { redirectToReferrer, checkingLogin } = this.state;


       ///////// From here down, depending on state, the page will display one of the 3 options
       if (checkingLogin) {
           return <IndeterminateProgress message="Checking Login Status..." />;
       }
       if (redirectToReferrer) {
           return (
               <Redirect to={from} />
           );
       }

       return (
           <Fragment>
                <p>You must be logged in to view this page.</p>
                <form onSubmit={this.login}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" className="form-control" type="email" onChange={this.handleChange} required /> 
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" className="form-control" type="password" onChange={this.handleChange} required /> 
                    </div>
                    {this.state.feedbackMessage ? (
                        <p>{ this.state.feedbackMessage }</p>
                    ): null}
                    <input type="submit" value="Login" className="btn btn-primary" />
                </form>
            </Fragment>
       );
    }
}

export default Login;