import React, { Component } from 'react';
import LeagueService from '../../services/league.service'
import { Button, Header, Table, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class TeamsComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      teams: [],
    }
  }

  async componentDidMount() {
    this.loadTeams()
  }

  async loadTeams() {
    const teams = await LeagueService.getTeams(this.props.match.params.leagueId)

    this.setState({ teams, open: false })
  }

  show = () => this.setState({ open: true })
  handleDelete = async (teamId) => {
    if (window.confirm('Opravdu smazat?')) {
      await LeagueService.deleteTeam(this.props.match.params.leagueId, teamId)
      this.loadTeams()
    }
  }


  render() {
    return (
      <div>
        <Header as="h1">Týmy</Header>
        <Link to={`/leagues/${this.props.match.params.leagueId}/teams/form/new`}>
          <Button primary>
            Přidat tým
          </Button>
        </Link>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Jméno</Table.HeaderCell>
              <Table.HeaderCell>Liga</Table.HeaderCell>
              <Table.HeaderCell>Sport</Table.HeaderCell>
              <Table.HeaderCell>Akce</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.teams && this.state.teams.map(team => (
              <Table.Row>
                <Table.Cell>
                  <Label ribbon>{team.team.name} {team.team.shortcut}</Label>
                  <button onClick={() => this.handleDelete(team.id)}>Smazat</button>
                </Table.Cell>
                <Table.Cell>{team.league.name}</Table.Cell>
                <Table.Cell>{team.league.sport.name}</Table.Cell>
                <Table.Cell />
              </Table.Row>
          ))}
          </Table.Body>
        </Table>
      </div>
    )
  }
}
