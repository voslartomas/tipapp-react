import React, { useState, useEffect } from 'react'
import LoginFormComponent from './components/loginForm.component'
import SecuredComponent from './components/secured.component'
import './App.css'
import moment from 'moment'
import 'moment/locale/cs'
import RegisterFormComponent from './components/registerForm.component'
import { Route } from 'react-router-dom'

moment.locale('cs')

export default function App() {
  const loggedIn = () => localStorage.getItem('token') && localStorage.getItem('token').length;
  const [action, setAction] = useState();
  const [user, setUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(loggedIn);


  const login = () => {
    console.log('loging in')
    setAction('login');
    setIsLoggedIn(loggedIn())
  }

  const logout = () => {
    console.log('loging out')
    localStorage.setItem('token', '')
    setIsLoggedIn(loggedIn())
    window.location.pathname = ''
    setAction('logout');
  }

  return (
    <div className="main">
      <Route exact path="/register" component={RegisterFormComponent} />
      {!isLoggedIn && <LoginFormComponent login={() => login()} />}
      {isLoggedIn && <SecuredComponent logout={() => logout()} />}
    </div>
  )
}
