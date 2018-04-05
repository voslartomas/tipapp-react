import React, { Component } from 'react'
import LeagueService from '../../services/league.service'
import SportService from '../../services/sport.service'
import { Card, Header, Form, Checkbox, Input, Button } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import TeamService from '../../services/team.service'

export default class TeamFormComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      team: {},
      sportsOptions: [],
      leaguesOptions: [],
      redirect: undefined,
    }
  }

  async componentDidMount() {
    const teamId = this.props.match.params.leagueId
    let team = {}
    if (teamId !== 'new') {
      try {
        team = await TeamService.getTeamById(teamId)
      } catch (e) {
        console.error(e)
      }
    }

    const sports = await SportService.getSports()
    const sportsOptions = sports.map(sport => ({
      key: sport.id,
      text: sport.czName,
      value: sport.id,
    }))

    //console.log(sportsOptions)

    const leagues = await LeagueService.getAllLeagues()
    const leaguesOptions = leagues.map(league => ({
      key: league.id,
      text: league.name,
      value: league.id,
    }))

    this.setState({
      sportsOptions,
      leaguesOptions,
      team,
    })
  }

  async saveForm() {
    if (this.state.team.id) {
      await TeamService.update(this.state.team, this.state.team.id)
    } else {
      await TeamService.create(this.state.team)
    }

    this.setState({
      redirect: `/leagues/${this.state.team.leagueId}/teams`,
    })
  }

  render() {
    const { redirect } = this.state

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    return (
      <div>
        <Header as="h1">Přidat/Upravit tým</Header>
        <Form onSubmit={() => this.saveForm()}>
          <Form.Field>
            <label>Český název</label>
            <Input
              required
              placeholder="Český název týmu"
              value={this.state.team.czName}
              onChange={event => this.setState({ team: { ...this.state.team, czName: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <label>Anglický název</label>
            <Input
              required
              placeholder="Anglický název týmu"
              value={this.state.team.engName}
              onChange={event => this.setState({ team: { ...this.state.team, engName: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <label>Zkratka</label>
            <Input
              required
              placeholder="Zkratka týmu"
              value={this.state.team.shortcut}
              onChange={event => this.setState({ team: { ...this.state.team, shortcut: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <Form.Select
              fluid
              required
              label="Sport"
              options={this.state.sportsOptions}
              value={this.state.team.sportId}
              placeholder="Vyberte sport"
              onChange={(event, { name, value }) => {
                this.setState({ team: { ...this.state.team, sportId: value } })
              }}
            />
          </Form.Field>
          <Form.Field>
            <Form.Select
              fluid
              required
              label="Liga"
              options={this.state.leaguesOptions}
              value={this.state.team.leagueId}
              placeholder="Vyberte ligu"
              onChange={(event, { name, value }) => {
                this.setState({ team: { ...this.state.team, leagueId: value } })
              }}
            />
          </Form.Field>
          <Button type="submit">Potvrdit změny</Button>
        </Form>
      </div>
    )
  }
}
