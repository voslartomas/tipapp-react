import React, { useState } from 'react'
import LoginFormComponent from './components/loginForm.component'
import SecuredComponent from './components/secured.component'
import './App.css'
import moment from 'moment'
import 'moment/locale/cs'
import RegisterFormComponent from './components/registerForm.component'
import { Route } from 'react-router-dom'

moment.locale('cs')

export default function App() {
  const [action, setAction] = useState();
  const [user, setUser] = useState()

  const login = () => {
    setAction('login');
  }

  const logout = () => {
    console.log('loging out')
    localStorage.setItem('token', '')
    window.location.pathname = ''
    setAction('logout');
  }

  const isLoggedIn = localStorage.getItem('token') && localStorage.getItem('token').length > 0

  return (
    <div className="main">
      <Route exact path="/register" component={RegisterFormComponent} />
      {!isLoggedIn && <LoginFormComponent login={() => login()} />}
      {isLoggedIn && <SecuredComponent logout={() => logout()} />}
    </div>
  )
}
