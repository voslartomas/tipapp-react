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
    const { teamId, leagueId } = this.props.match.params
    let team = {
      leagueId,
    }
    if (teamId !== 'new') {
      try {
        team = await TeamService.getTeamById(teamId)
      } catch (e) {
        console.error(e)
      }
    }

    const teams = await TeamService.getAllTeams()
    const teamsOptions = teams.map(team => ({
      key: team.id,
      text: team.name,
      value: team.id,
    }))

    this.setState({
      teamsOptions,
      team,
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
              label="Tým"
              options={this.state.teamsOptions}
              value={this.state.team.teamId}
              placeholder="Vyberte tým"
              onChange={(event, { name, value }) => {
                this.setState({ team: { ...this.state.team, teamId: value } })
              }}
            />
          </Form.Field>
          <Button type="submit">Potvrdit změny</Button>
        </Form>
      </div>
    )
  }
}
