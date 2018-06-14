import React, { Component } from 'react'
import { Card, Header, Form, Checkbox, Input, Button, Message, Popup, Image, Modal } from 'semantic-ui-react'
import UserService from '../services/user.service';
import { Link, Redirect } from 'react-router-dom'

export default class PasswordComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      passwordNew: "",
      passwordNewAgain: "",
      redirect: undefined,
      error: false
    }
  }

  async saveForm() {
    if (this.state.passwordNew == this.state.passwordNewAgain) {
      await UserService.changePassword({password: this.state.passwordNew});
      this.setState({
        redirect: '/profile/',
      })
    } else {
      this.setState({error: true})
    }
  }

  render() {
    const { redirect } = this.state

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    return(
      <div>
        <Header as="h1">Změna hesla</Header>
        <Form onSubmit={() => this.saveForm()}>
          <Form.Field>
            <label>Nové heslo</label>
            <Input
              required
              type="password"
              placeholder="Nové heslo"
              value={this.state.passwordNew}
              onChange={event => this.setState({passwordNew: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Nové heslo znovu</label>
            <Input
              required
              type="password"
              placeholder="Nové heslo znovu"
              value={this.state.passwordNewAgain}
              onChange={event => this.setState({passwordNewAgain: event.target.value })}
            />
          </Form.Field>
          <Button type="submit">Potvrdit změnu</Button>
          {this.state.error && <Message negative>
            <Message.Header>Zadaná hesla se neshodují!</Message.Header>
            <p>Zadejte je znovu tak, aby se hesla v obou polích shodovala.</p>
          </Message>}
        </Form>
      </div>
    );
  }
}