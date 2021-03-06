import React, { Component } from 'react'
import { Header, Form, Checkbox, Input, Button } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import MatchService from '../../services/match.service';
import TeamService from '../../services/team.service';
import LeagueService from '../../services/league.service';
import PlayerService from '../../services/player.service'

export default class MatchFormComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      match: {},
      leaguesOptions: [],
      teamsOptions: [],
      players: [],
      redirect: undefined,
    }
  }

  async componentDidMount() {
    const { matchId, leagueId } = this.props.match.params
    let match = { leagueId }
    let players
    if (matchId !== 'new') {
      try {
        match = await MatchService.getMatchById(matchId)
        console.log(match)
        match.scorers = await MatchService.getMatchScorersById(matchId)
        match.dateTime = moment(match.dateTime)

        players = await PlayerService.getPlayersByTeams(this.props.match.params.leagueId, [match.homeTeamId, match.awayTeamId])
      } catch (e) {
        console.error(e)
      }
    }

    const teams = await TeamService.getTeams(leagueId)
    const teamsOptions = teams.map(leagueTeam => ({
      key: leagueTeam.id,
      text: leagueTeam.team.name,
      value: leagueTeam.id,
    }))

    const leagues = await LeagueService.getAllLeagues()
    const leaguesOptions = leagues.map(league => ({
      key: league.id,
      text: league.name,
      value: league.id,
    }))

    this.setState({
      teamsOptions,
      leaguesOptions,
      players,
      match,
    })
  }

  getPlayers(match) {
    if (!this.state.players) {
      return []
    }

    return this.state.players.filter(player => player.leagueTeamId === match.homeTeamId || player.leagueTeamId === match.awayTeamId)
      .map(player => ({
        key: player.id,
        text: `${player.player.firstName} ${player.player.lastName} ${player.leagueTeam.team.shortcut}`,
        value: player.id,
      }))
  }

  async saveForm() {
    if (this.state.match.id) {
      await MatchService.update(this.state.match, this.state.match.id)
    } else {
      await MatchService.create(this.state.match)
    }

    this.setState({
      redirect: `/leagues/${this.state.match.leagueId}/matches`,
    })
  }

  render() {
    const { redirect } = this.state

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    return (
      <div>
        <Header as="h1">Přidat/Upravit zápas</Header>
        <Form onSubmit={() => this.saveForm()}>
          <Form.Field style={{ display: 'none' }}>
            <Form.Select
              fluid
              required
              label="Liga"
              options={this.state.leaguesOptions}
              value={this.state.match.leagueId}
              placeholder="Vyberte ligu"
              onChange={(event, { name, value }) => {
                this.setState({ match: { ...this.state.match, leagueId: value } })
              }}
            />
          </Form.Field>
          <Form.Field>
            <Form.Select
              fluid
              required
              label="Domácí tým"
              options={this.state.teamsOptions}
              value={this.state.match.homeTeamId}
              placeholder="Vyberte domácí tým"
              onChange={(event, { name, value }) => {
                this.setState({ match: { ...this.state.match, homeTeamId: value } })
              }}
            />
          </Form.Field>
          <Form.Field>
            <Form.Select
              fluid
              required
              label="Tým hosté"
              options={this.state.teamsOptions}
              value={this.state.match.awayTeamId}
              placeholder="Vyberte tým hostů"
              onChange={(event, { name, value }) => {
                this.setState({ match: { ...this.state.match, awayTeamId: value } })
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>Skóre domácí</label>
            <Input
              placeholder="Skóre domácí"
              value={this.state.match.homeScore}
              onChange={event => this.setState({ match: { ...this.state.match, homeScore: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <label>Skóre hosté</label>
            <Input
              placeholder="Skóre hosté"
              value={this.state.match.awayScore}
              onChange={event => this.setState({ match: { ...this.state.match, awayScore: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <label>Střelci</label>
            <Form.Select
              fluid
              required
              search
              multiple
              value={this.state.match.scorers}
              onChange={(e, { name, value }) => this.setState({ match: { ...this.state.match, scorers: value} })}
              options={this.getPlayers(this.state.match)}
              placeholder="Vyberte hráče"
            />
          </Form.Field>
          <Form.Field>
            <label>Vyberte datum a čas</label>
            <DatePicker
              selected={this.state.match.dateTime}
              onChange={event => this.setState({ match: { ...this.state.match, dateTime: event } })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="LLL"
              timeCaption="time"
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="Prodloužení"
              checked={this.state.match.overtime}
              onChange={() => this.setState({ match: { ...this.state.match, overtime: !this.state.match.overtime } })}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="Nájezdy"
              checked={this.state.match.shotout}
              onChange={() => this.setState({ match: { ...this.state.match, shotout: !this.state.match.shotout } })}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="Vítěz"
              checked={this.state.match.winner}
              onChange={() => this.setState({ match: { ...this.state.match, winner: !this.state.match.winner } })}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="Vyřazovací zápas"
              checked={this.state.match.isPlayoffGame}
              onChange={() => this.setState({ match: { ...this.state.match, isPlayoffGame: !this.state.match.isPlayoffGame } })}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="Je vyhodnocený"
              checked={this.state.match.isEvaluated}
              onChange={() => this.setState({ match: { ...this.state.match, isEvaluated: !this.state.match.isEvaluated } })}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="Dvojnásobné body"
              checked={this.state.match.isDoubled}
              onChange={() => this.setState({ match: { ...this.state.match, isDoubled: !this.state.match.isDoubled } })}
            />
          </Form.Field>
          <Button type="submit">Potvrdit změny</Button>
        </Form>
      </div>
    )
  }
}
