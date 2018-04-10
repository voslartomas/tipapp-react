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

    const sports = await SportService.getSports()
    const sportsOptions = sports.map(sport => ({
      key: sport.id,
      text: sport.name,
      value: sport.id,
    }))

    this.setState({
      sportsOptions,
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
            <label>Název týmu</label>
            <Input
              required
              placeholder="Název týmu"
              value={this.state.team.name}
              onChange={event => this.setState({ team: { ...this.state.team, name: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <label>Přezdívka týmu</label>
            <Input
              required
              placeholder="Přezdívka týmu"
              value={this.state.team.nickname}
              onChange={event => this.setState({ team: { ...this.state.team, nickname: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <label>Zkratka týmu</label>
            <Input
              required
              placeholder="Zkratka týmu"
              value={this.state.team.shortcut}
              onChange={event => this.setState({ team: { ...this.state.team, shortcut: event.target.value } })}
            />
          </Form.Field>
          <Button type="submit">Potvrdit změny</Button>
        </Form>
      </div>
    )
  }
}
