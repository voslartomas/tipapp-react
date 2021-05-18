import React, { Component } from 'react';
import { Button, Form, Grid, Header, Segment, Message } from 'semantic-ui-react'
import api from '../helpers/api'
import { loadingComponent } from '../helpers/utils';

export default class LoginFormComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      isLoading: false,
      isError: false,
    }
  }

  async logIn() {
    this.setState({ isLoading: true, isError: false })
    try {
      const response = await api.post('login', this.state)
      const token = response ? response.text : ''
      localStorage.setItem('token', token)
      
    } catch (error) {
      this.setState({ isError: true })
    }

    this.props.login()
    this.setState({ isLoading: false })
  }

  render() {
    return (
      <React.Fragment>
      {loadingComponent(this.state.isLoading)}
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
            <Header as="h2" color="yellow" textAlign="center">
              Přihlášení
            </Header>
            <Form size="large">
              <Segment stacked backgroundColor="black">
                {this.state.isError && <Message color="red">Nastala chyba při přihlášení</Message>}
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Uživatelské jméno"
                  value={this.state.username}
                  onChange={event => this.setState({ username: event.target.value })}
                />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Heslo"
                  type="password"
                  value={this.state.password}
                  onChange={event => this.setState({ password: event.target.value })}
                />

                <Button color="yellow" fluid size="large" onClick={() => this.logIn()}>Přihlásit se<i style={{ marginLeft: '5px' }} className="sign in icon" /></Button>
                {/* <Link to='/register'>Nemáš ještě účet? Registruj se…</Link> */}
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
      </React.Fragment>
    )
  }
}
