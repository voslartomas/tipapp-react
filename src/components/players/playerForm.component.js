import React, { Component } from 'react'
import { Card, Header, Form, Checkbox, Input, Button } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import PlayerService from '../../services/player.service'
import LeagueService from '../../services/league.service'

export default class PlayerFormComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      player: {},
      redirect: undefined,
    }
  }

  async componentDidMount() {
    const { playerId, leagueId } = this.props.match.params
    let player = {
      leagueId,
    }
    if (playerId !== 'new') {
      try {
        player = await PlayerService.getPlayerById(playerId)
      } catch (e) {
        console.error(e)
      }
    }

    this.setState({
      player,
    })
  }

  async saveForm() {
    await LeagueService.createPlayer(this.props.match.params.leagueId, this.state.player)

    this.setState({
      redirect: `/leagues/${this.state.player.leagueId}/player`,
    })
  }

  render() {
    const { redirect } = this.state

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    return (
      <div>
        <Header as="h1">Přidat hráče</Header>
        <Form onSubmit={() => this.saveForm()}>
          <Form.Field>
            <label>Křestní jméno hráče</label>
            <Input
              placeholder="Křestní jméno hráče"
              value={this.state.player.firstName}
              onChange={event => this.setState({ player: { ...this.state.player, firstName: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <label>Příjmení hráče</label>
            <Input
              placeholder="Příjmení hráče"
              value={this.state.player.lastName}
              onChange={event => this.setState({ player: { ...this.state.player, lastName: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="Aktivní"
              defaultChecked
              checked={this.state.player.isActive}
              onChange={() => this.setState({ player: { ...this.state.player, isActive: this.state.player.isActive } })}
            />
          </Form.Field>
          <Button type="submit">Potvrdit změny</Button>
        </Form>
      </div>
    )
  }
}
