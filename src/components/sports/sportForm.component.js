import React, { Component } from 'react'
import SportService from '../../services/sport.service'
import { Header, Form, Input, Button } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'

export default class SportFormComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sport: {},
      redirect: undefined,
    }
  }

  async componentDidMount() {
    const sportId = this.props.match.params.sportId
    let sport = {}
    if (sportId !== 'new') {
      sport = await SportService.getSportById(sportId)
    }

    this.setState({
      sport,
    })
  }

  async saveForm() {
    if (this.state.sport.id) {
      await SportService.update(this.state.sport, this.state.sport.id)
    } else {
      await SportService.create(this.state.sport)
    }

    this.setState({
      redirect: '/',
    })
  }

  render() {
    const { redirect } = this.state

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    return (
      <div>
        <Header as="h1">Přidat/Upravit sport</Header>
        <Form onSubmit={() => this.saveForm()}>
          <Form.Field>
            <label>Název</label>
            <Input
              required
              placeholder="Název sportu"
              value={this.state.sport.name}
              onChange={event => this.setState({ sport: { ...this.state.sport, name: event.target.value } })}
            />
          </Form.Field>
          <Button type="submit">Potvrdit změny</Button>
        </Form>
      </div>
    )
  }
}
