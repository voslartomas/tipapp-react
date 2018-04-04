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
          {/* <Form.Field>
            <label>Sezóna od</label>
            <Input
              placeholder="Sezóna od"
              value={this.state.league.seasonFrom}
              onChange={event => this.setState({ league: { ...this.state.league, seasonFrom: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <label>Sezóna do</label>
            <Input
              placeholder="Sezóna do"
              value={this.state.league.seasonTo}
              onChange={event => this.setState({ league: { ...this.state.league, seasonTo: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <Form.Select
              fluid
              required
              label="Sport"
              options={this.state.sportsOptions}
              value={this.state.league.sportId}
              placeholder="Vyberte sport"
              onChange={(event, { name, value }) => {
                this.setState({ league: { ...this.state.league, sportId: value } })
              }}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="Aktivní"
              checked={this.state.league.isActive}
              onChange={() => this.setState({ league: { ...this.state.league, isActive: !this.state.league.isActive } })}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="Dokončená"
              checked={this.state.league.isFinished}
              onChange={() => this.setState({ league: { ...this.state.league, isFinished: !this.state.league.isFinished } })}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="Nejvíce aktivní"
              checked={this.state.league.isMostActive}
              onChange={() => this.setState({ league: { ...this.state.league, isMostActive: !this.state.league.isMostActive } })}
            />
          </Form.Field> */}
          <Button type="submit">Potvrdit změny</Button>
        </Form>
      </div>
    )
  }
}
