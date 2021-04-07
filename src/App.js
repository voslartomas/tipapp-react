import React, { Component } from 'react';
import moment from 'moment';
import { Route } from 'react-router-dom';
import LoginFormComponent from './components/loginForm.component';
import SecuredComponent from './components/secured.component';
import './App.css';
import 'moment/locale/cs';
import RegisterFormComponent from './components/registerForm.component';

moment.locale('cs');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      action: undefined,
    };
  }

  setUser(user) {
    this.setState({
      user,
    });
  }

  login() {
    this.setState({ action: 'login' });
  }

  logout() {
    console.log('loging out');
    localStorage.setItem('token', '');
    this.setState({ action: 'logout' });
  }

  render() {
    const isLoggedIn = localStorage.getItem('token') && localStorage.getItem('token').length;

    return (
      <div className="main">
        <Route exact path="/register" component={RegisterFormComponent} />
        {!isLoggedIn && <LoginFormComponent login={() => this.login()} />}
        {isLoggedIn && <SecuredComponent logout={() => this.logout()} />}
      </div>
    );
  }
}

export default App;
