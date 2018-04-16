import React, { Component } from 'react'
import LeagueService from '../../services/league.service'
import { Header, Table, Divider, Label } from 'semantic-ui-react'


export default class LeaderBoardComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      players: [],
    }
  }

  async componentDidMount() {
    this.loadPlayers()
  }

  async loadPlayers() {
    const players = await LeagueService.getLeaderBoard(this.props.match.params.leagueId)

    this.setState({ players })
  }

  render() {
    return (
      <div>
        <Header as="h1">Tabulka</Header>
        <Divider />
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Pořadí</Table.HeaderCell>
              <Table.HeaderCell>Jméno</Table.HeaderCell>
              <Table.HeaderCell>Body</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.players && this.state.players.map((player, i) => (
              <Table.Row>
                <Table.Cell>
                  <Label ribbon>{i+1}.</Label>
                </Table.Cell>
                <Table.Cell>{player.firstName} {player.lastName}</Table.Cell>
                <Table.Cell>{player.totalPoints}</Table.Cell>
              </Table.Row>
          ))}
          </Table.Body>
        </Table>
      </div>
    )
  }
}
