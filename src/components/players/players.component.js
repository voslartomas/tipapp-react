import React, { Component } from 'react';
import PlayerService from '../../services/player.service'
import { Button, Icon, Header, Table, Label } from 'semantic-ui-react'

export default class PlayersComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      players: [],
    }
  }

  async componentDidMount() {
    const players = await PlayerService.getPlayers(this.props.match.params.leagueId)

    this.setState({ players })
  }

  render() {
    return (
      <div>
        <Header as="h1">Hráči</Header>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Jméno</Table.HeaderCell>
              <Table.HeaderCell>Tým</Table.HeaderCell>
              <Table.HeaderCell>Zápasy</Table.HeaderCell>
              <Table.HeaderCell>Góly</Table.HeaderCell>
              <Table.HeaderCell>Asistence</Table.HeaderCell>
              <Table.HeaderCell>Body</Table.HeaderCell>
              <Table.HeaderCell>Akce</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.players && this.state.players.map(leaguePlayer => (
              <Table.Row>
                <Table.Cell>
                  <Label ribbon>{leaguePlayer.player.firstName} {leaguePlayer.player.lastName}</Label>
                </Table.Cell>
                <Table.Cell>{leaguePlayer.leagueTeam.team.name}</Table.Cell>
                <Table.Cell>{leaguePlayer.seasonGames}</Table.Cell>
                <Table.Cell>{leaguePlayer.seasonGoals}</Table.Cell>
                <Table.Cell>{leaguePlayer.seasonAssists}</Table.Cell>
                <Table.Cell>{leaguePlayer.seasonGoals + leaguePlayer.seasonAssists}</Table.Cell>
              </Table.Row>
          ))}
          </Table.Body>
        </Table>
      </div>
    )
  }
}
