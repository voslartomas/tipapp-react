import React, { Component } from 'react';
import TeamService from '../../services/team.service'
import { Button, Image, Icon, Header, Table, Label } from 'semantic-ui-react'

export default class TeamsComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      teams: [],
    }
  }

  async componentDidMount() {
    const teams = await TeamService.getTeams(this.props.match.params.leagueId)

    this.setState({ teams })
  }

  render() {
    return (
      <div>
        <Header as="h1">Týmy</Header>
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
                  <Label ribbon>{team.czName} {team.shortcut}</Label>
                </Table.Cell>
                <Table.Cell>{team.league.name}</Table.Cell>
                <Table.Cell>{team.sport.czName}</Table.Cell>
                <Table.Cell />
              </Table.Row>
          ))}
          </Table.Body>
        </Table>
      </div>
    )
  }
}
