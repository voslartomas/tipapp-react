import React, { Component } from 'react'
import { Card, Header, Form, Checkbox, Input, Button } from 'semantic-ui-react'
import UserService from '../services/user.service'
import { Link, Redirect } from 'react-router-dom'

export default class UserFormComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {},
      redirect: undefined,
    }
  }

  async componentDidMount() {
    const userId = this.props.match.params.userId
    let user = {}
    if (userId !== 'new') {
      user = await UserService.getUserById(userId)
    }
    this.setState({
      user,
    })
  }

  async saveForm() {
    if (this.state.user.id) {
      await UserService.update(this.state.user, this.state.user.id)
    }
    this.setState({
      redirect: '/profile/',
    })
  }

  render() {
    const { redirect } = this.state

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    return (
      <div>
        <Header as="h1">Upravit profil</Header>
        <Form onSubmit={() => this.saveForm()}>
          <Form.Field>
            <label>Křestní jméno</label>
            <Input
              required
              placeholder="Křestní jméno"
              value={this.state.user.firstName}
              onChange={event => this.setState({ user: { ...this.state.user, firstName: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <label>Příjmení</label>
            <Input
              required
              placeholder="Příjmení"
              value={this.state.user.lastName}
              onChange={event => this.setState({ user: { ...this.state.user, lastName: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <label>E-Mail</label>
            <Input
              required
              placeholder="E-Mail"
              value={this.state.user.email}
              onChange={event => this.setState({ user: { ...this.state.user, email: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <label>Telefon</label>
            <Input
              required
              placeholder="Telefon"
              value={this.state.user.mobileNumber}
              onChange={event => this.setState({ user: { ...this.state.user, mobileNumber: event.target.value } })}
            />
          </Form.Field>
          <Button type="submit">Potvrdit změny</Button>
        </Form>
      </div>
    )
  }

}