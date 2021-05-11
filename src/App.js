import React, { Component } from 'react'
import LoginFormComponent from './components/loginForm.component'
import SecuredComponent from './components/secured.component'
import './App.css'
import moment from 'moment'
import 'moment/locale/cs'
import RegisterFormComponent from './components/registerForm.component'
import { Route } from 'react-router-dom'

moment.locale('cs')

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      action: undefined,
    }
  }

  login() {
    this.setState({ action: 'login' })
  }

  logout() {
    console.log('loging out')
    localStorage.setItem('token', '')
    this.setState({ action: 'logout' })
  }

  setUser(user) {
    this.setState({
      user,
    })
  }

  render() {
    const isLoggedIn = localStorage.getItem('token') && localStorage.getItem('token').length > 0

    return (
      <div className="main">
        <Route exact path='/register' component={RegisterFormComponent} />
        {!isLoggedIn && <LoginFormComponent login={() => this.login()} />}
        {isLoggedIn && <SecuredComponent logout={() => this.logout()} />}
      </div>
    )
  }
}

export default App
