import React from 'react';

import { login } from './service';

import { Link, Redirect } from 'react-router-dom';

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
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
    login({
      email: this.state.email,
      password: this.state.password
    })
    .then((res) => {
      let token = res.data.token;
      let user_id = res.data.user_id;
      localStorage.setItem('token', token);
      localStorage.setItem('user_id', user_id);
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
    const { location } = this.props;
    let redirectionUrl = '/home';
    if(location && location.state && location.state.from) {
      redirectionUrl = location.state.from;
    }
    if (redirect) {
      return <Redirect to={ redirectionUrl }/>;
    }
    return (
      <div className="login-mn">
        <div className="mn-login">
          <img className="mn-001" src="../simio-02.svg"  width="200px" alt=""/>
            <img className="mn-002" src="../banana.svg"  width="100px" alt=""/>
            <img className="mn-003" src="../planeta.svg"  width="100px" alt=""/>
            <img className="mn-004" src="../tierra.svg"  width="100px" alt=""/>
          </div>
        <div className="login">
          <div className="login_image">
            <img src="../logo.svg" height="150px" alt=""/>
          </div>
          <div className="login_content">
            <form onSubmit={this.handleSubmit}>
              <div className="login_content_form">
                <input type="text" value={this.state.email} onChange={this.handleChangeEmail} placeholder="Username"/>
              </div>
              <div className="login_content_form">
                <input type="password" value={this.state.password} onChange={this.handleChangePassword} placeholder="Password"/>
              </div>
              <button className="login_btn">Login</button>
            </form>
            <div className="link-01">
              <Link to="/register">Don't have account yet?</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login;
