import React from 'react';

import { register } from './service';

import { Redirect } from 'react-router-dom';

class Register extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      err: ''
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChangePassword = event => {
    this.setState({
      password: event.target.value
    });
  }

  handleChangeEmail = event => {
    this.setState({
      email: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    register({
      email: this.state.email,
      password: this.state.password
    })
    .then((res) => {
      this.setState({
        redirect: true
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render() {
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to='/login'/>;
    }
    return (

      <div className="login-mn">
      <div className="login">
        <div className="login_content">
          <h6 className="title-01">Register</h6>
          <form onSubmit={this.handleSubmit}>
            <div className="login_content_form">
              <input type="text" value={this.state.email} onChange={this.handleChangeEmail} placeholder="Username"/>
            </div>
            <div className="login_content_form">
              <input type="password" value={this.state.password} onChange={this.handleChangePassword} placeholder="Password"/>
            </div>
            <button className="login_btn" type="submit" disabled={!this.validateForm()}> Register </button>
          </form>
        </div>
      </div>
      </div>
    )
  }
}

export default Register;
