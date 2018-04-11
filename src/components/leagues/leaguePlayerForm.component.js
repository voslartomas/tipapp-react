import React, { Component } from 'react'
import { Card, Header, Form, Checkbox, Input, Button } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import PlayerService from '../../services/player.service'
import LeagueService from '../../services/league.service'
import TeamService from '../../services/team.service';

export default class LeaguePlayerFormComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      leaguePlayer: {},
      playersOptions: [],
      leagueTeamsOptions: [],
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
        player = await LeagueService.getPlayerById(leagueId, playerId)
      } catch (e) {
        console.error(e)
      }
    }

    const teams = await TeamService.getTeams(leagueId)
    const leagueTeamsOptions = teams.map(leagueTeam => ({
      key: leagueTeam.id,
      text: leagueTeam.team.name,
      value: leagueTeam.id,
    }))

    const players = await PlayerService.getAllPlayers()
    const playersOptions = players.map(player => ({
      key: player.id,
      text: player.firstName + " " + player.lastName,
      value: player.id,
    }))

    this.setState({
      player,
      leagueTeamsOptions,
      playersOptions,
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

    console.log(this.state.player)

    return (
      <div>
        <Header as="h1">Přidat hráče</Header>
        <Form onSubmit={() => this.saveForm()}>
        <Form.Field>
            <Form.Select
              fluid
              required
              label="Tým"
              options={this.state.leagueTeamsOptions}
              value={this.state.player.leagueTeamId}
              placeholder="Vyberte tým"
              onChange={(event, { name, value }) => {
                this.setState({ player: { ...this.state.player, leagueTeamId: value } })
              }}
            />
          </Form.Field>
          <Form.Field>
            <Form.Select
              fluid
              required
              label="Hráč"
              options={this.state.playersOptions}
              value={this.state.player.playerId}
              placeholder="Vyberte hráče"
              onChange={(event, { name, value }) => {
                this.setState({ player: { ...this.state.player, playerId: value } })
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>Hry za sezónu</label>
            <Input
              placeholder="Hry za sezónu"
              value={this.state.player.seasonGames}
              onChange={event => this.setState({ player: { ...this.state.player, seasonGames: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <label>Góly za sezónu</label>
            <Input
              placeholder="Góly za sezónu"
              value={this.state.player.seasonGoals}
              onChange={event => this.setState({ player: { ...this.state.player, seasonGoals: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <label>Asistence za sezónu</label>
            <Input
              placeholder="Asistence za sezónu"
              value={this.state.player.seasonAssists}
              onChange={event => this.setState({ player: { ...this.state.player, seasonAssists: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="Nejlepší střelec"
              checked={this.state.player.bestScorer}
              onChange={event => this.setState({ player: { ...this.state.player, bestScorer: !this.state.player.bestScorer } })}
            />
          </Form.Field>
          <Button type="submit">Potvrdit změny</Button>
        </Form>
      </div>
    )
  }
}
