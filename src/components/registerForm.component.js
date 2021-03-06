import React, { Component } from 'react';
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react'
import api from '../helpers/api'
import RegisterService from '../services/register.service'
import { Redirect } from 'react-router-dom'

export default class RegisterFormComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {},
      redirect: undefined
    }
  }

  async register() {
    RegisterService.register(this.state.user)

    this.setState({
      redirect: '/'
    })
  }

  render() {
    const { redirect } = this.state

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    return (
      <div className="login-form">
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
            height: 100%;
          }
        `}
        </style>
        <Grid
          textAlign="center"
          style={{ height: '100%' }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="teal" textAlign="center">
              Registrace
            </Header>
            <Form size="large">
              <Segment stacked>
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Křestní jméno"
                  value={this.state.user.firstName}
                  onChange={event => this.setState({ user: {...this.state.user, firstName: event.target.value }})}
                />
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Příjmení"
                  value={this.state.user.lastName}
                  onChange={event => this.setState({ user: {...this.state.user, lastName: event.target.value }})}
                />
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Uživatelské jméno"
                  value={this.state.user.username}
                  onChange={event => this.setState({ user: {...this.state.user, username: event.target.value }})}
                />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Heslo"
                  type="password"
                  value={this.state.user.password}
                  onChange={event => this.setState({ user: {...this.state.user, password: event.target.value }})}
                />
                <Button color="teal" fluid size="large" onClick={() => this.register()}>Registrovat se<i style={{ marginLeft: '5px' }} className="sign in icon" /></Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}
