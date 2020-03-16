import React, { Component } from 'react'
import {
  Button,
  Checkbox,
  Message,
  Form,
  Grid,
  Header,
  Segment
} from 'semantic-ui-react'
import api from '../helpers/api'
import { Link } from 'react-router-dom'

export default class LoginFormComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      permanentLogin: ''
    };
  }

  async logIn() {
    const response = await api.post('login', this.state);
    const token = response ? response.text : ''

    localStorage.setItem('token', token)
    this.props.login()
  }

  render() {
    return (
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="black" textAlign="center">
            Přihlášení
          </Header>
          <Form size="large">
            <Segment stacked>
              <Form.Input
                icon="user"
                iconPosition="left"
                placeholder="Uživatelské jméno"
                value={this.state.username}
                onChange={event =>
                  this.setState({ username: event.target.value })
                }
              />
              <Form.Input
                icon="lock"
                iconPosition="left"
                placeholder="Heslo"
                type="password"
                value={this.state.password}
                onChange={event =>
                  this.setState({ password: event.target.value })
                }
              />
              <Checkbox
                label="Zapamatovat si mě"
                style={{ marginBottom: 10 }}
              />{" "}
              {/* TODO */}
              <Button
                color="orange"
                fluid
                size="large"
                onClick={() => this.logIn()}
              >
                Přihlásit se
              </Button>
            </Segment>
          </Form>
          {/* TODO Smaller height here */}
          <Message>
            <Grid columns="equal">
              <Grid.Column>
                <Link to="/register">Registrace</Link>
              </Grid.Column>
              <Grid.Column>
                <Link to="/recoverPassword">Obnovit heslo</Link> {/* TODO */}
              </Grid.Column>
            </Grid>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}
