import React from 'react';

import { changePassword } from '../service';
import { Alert } from 'react-bootstrap';

class ChangePassword extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      repeatPassword: '',
      message: '',
      alertVariant: '',
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    if (!this.validateForm()) {
      this.setState({
        message: 'You need to provide old password and new password correctly.',
        alertVariant: 'danger'
      });
      return;
    }
    changePassword({
      oldPassword: this.state.oldPassword,
      newPassword: this.state.newPassword
    })
      .then((res) => {
        this.setState({
          message: 'Password changed correctly.',
          alertVariant: 'success'
        });
      })
      .catch((err) => {
        this.setState({
          message: 'Error while trying to change your password.',
          alertVariant: 'danger'
        });
      });
  }

  validateForm() {
    return this.state.oldPassword.length > 0 &&
      this.state.newPassword.length > 0 &&
      this.state.repeatPassword.length > 0 &&
      this.state.newPassword === this.state.repeatPassword;
  }

  handleOldPassword = event => {
    this.setState({
      oldPassword: event.target.value
    });
  }

  handleNewPassword = event => {
    this.setState({
      newPassword: event.target.value
    });
  }

  handleRepeatPassword = event => {
    this.setState({
      repeatPassword: event.target.value
    });
  }

  render() {
    const { oldPassword, newPassword, repeatPassword, message, alertVariant } = this.state;
    return (
      <div>
        <h3>Change Password</h3>
        <form onSubmit={this.handleSubmit}>
          <div className="login_content_form">
            <input type="password" value={oldPassword}
              onChange={this.handleOldPassword}
              autoComplete="current-password"
              placeholder="Old Password" />
          </div>
          <div className="login_content_form">
            <input type="password" value={newPassword}
              onChange={this.handleNewPassword}
              autoComplete="new-password"
              placeholder="New Password" />
          </div>
          <div className="login_content_form">
            <input type="password" value={repeatPassword}
              onChange={this.handleRepeatPassword}
              autoComplete="new-password"
              placeholder="Repeat New Password" />
          </div>
          <Alert variant={alertVariant}>{message}</Alert>
          <button className="login_btn">Change Password</button>
        </form>
      </div>
    );
  }
}

export default ChangePassword;