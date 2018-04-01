import React, { Component } from 'react'
import LoginFormComponent from './components/loginForm.component'
import SecuredComponent from './components/secured.component'
import './App.css'

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
    const isLoggedIn = localStorage.getItem('token').length > 0
    console.log(localStorage.getItem('token'), localStorage.getItem('token').length)
    return (
      <div>
        {!isLoggedIn && <LoginFormComponent login={() => this.login()} />}
        {isLoggedIn && <SecuredComponent logout={() => this.logout()} />}
      </div>
    )
  }
}

export default App
