import React, { Component } from 'react'
import MatchService from '../../services/match.service';
import { Card, Header, Form, Checkbox, Input, Button } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import TeamService from '../../services/team.service';
import LeagueService from '../../services/league.service';

export default class MatchFormComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      match: {},
      leaguesOptions: [],
      teamsOptions: [],
      redirect: undefined,
    }
  }

  async componentDidMount() {
    const matchId = this.props.match.params.id
    let match = {}
    if (matchId !== 'new') {
      try {
        match = await MatchService.getMatchById(matchId)
      } catch (e) {
        console.error(e)
      }
    }

    const teams = await TeamService.getAllTeams()
    const teamsOptions = teams.map(team => ({
      key: team.id,
      text: team.czName,
      value: team.id,
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
      match,
    })
  }

  async saveForm() {
    if (this.state.match.id) {
      await MatchService.update(this.state.match, this.state.match.id)
    } else {
      await MatchService.create(this.state.match)
    }

    this.setState({
      redirect: `/matches/${this.state.match.leagueId}`,
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
          <Form.Field>
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
              onChange={event => this.setState({ match: { ...this.state.match.homeScore, homeScore: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <label>Skóre hosté</label>
            <Input
              placeholder="Skóre hosté"
              value={this.state.match.awayScore}
              onChange={event => this.setState({ match: { ...this.state.match.awayScore, awayScore: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="Přesčas"
              checked={this.state.match.overtime}
              onChange={event => this.setState({ match: { ...this.state.match.overtime, overtime: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="Přesčas"
              checked={this.state.match.shotout}
              onChange={event => this.setState({ match: { ...this.state.match.shotout, shotout: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="Přesčas"
              checked={this.state.match.winner}
              onChange={event => this.setState({ match: { ...this.state.match.winner, winner: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="Přesčas"
              checked={this.state.match.isEvaluated}
              onChange={event => this.setState({ match: { ...this.state.match.isEvaluated, isEvaluated: event.target.value } })}
            />
          </Form.Field>
          <Button type="submit">Potvrdit změny</Button>
        </Form>
      </div>
    )
  }
}