import React, { Component } from 'react'
import LeagueService from '../../services/league.service'
import SportService from '../../services/sport.service'
import { Card, Header, Form, Checkbox, Input, Button } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import TeamService from '../../services/team.service'

export default class LeagueTeamFormComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      leagueTeam: {},
      leaguesOptions: [],
      teamsOptions: [],
      redirect: undefined,
    }
  }

  async componentDidMount() {
    const { leagueTeamId, leagueId } = this.props.match.params
    let leagueTeam = {
      leagueId,
    }
    if (leagueTeamId !== 'new') {
      try {
        leagueTeam = await TeamService.getTeamById(leagueTeamId)
      } catch (e) {
        console.error(e)
      }
    }

    const leagues = await LeagueService.getAllLeagues()
    const leaguesOptions = leagues.map(league => ({
      key: league.id,
      text: league.name,
      value: league.id,
    }))

    const teams = await TeamService.getAllTeams()
    const teamsOptions = teams.map(team => ({
      key: team.id,
      text: team.name,
      value: team.id,
    }))

    this.setState({
      leaguesOptions,
      teamsOptions,
      leagueTeam,
    })
  }

  async saveForm() {
    await LeagueService.createTeam(this.props.match.params.leagueId, this.state.team)

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
        <Header as="h1">Přidat tým</Header>
        <Form onSubmit={() => this.saveForm()}>
          <Form.Field>
            <Form.Select
              fluid
              required
              label="Liga"
              options={this.state.leaguesOptions}
              value={this.state.leagueTeam.leagueId}
              placeholder="Vyberte ligu"
              onChange={(event, { name, value }) => {
                this.setState({ leagueTeam: { ...this.state.leagueTeam, leagueId: value } })
              }}
            />
          </Form.Field>
          <Form.Field>
            <Form.Select
              fluid
              required
              label="Tým"
              options={this.state.teamsOptions}
              value={this.state.leagueTeam.teamId}
              placeholder="Vyberte tým"
              onChange={(event, { name, value }) => {
                this.setState({ leagueTeam: { ...this.state.leagueTeam, teamId: value } })
              }}
            />
          </Form.Field>
          <Button type="submit">Potvrdit změny</Button>
        </Form>
      </div>
    )
  }
}
