import React, { Component } from 'react'
import LeagueService from '../../../services/league.service'
import { Header, Table, Divider, Label } from 'semantic-ui-react'


export default class LeaderBoardComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      players: [],
      leagueId: undefined
    }
  }

  async componentDidMount() {
    this.loadPlayers()
  }

  async loadPlayers() {
    const players = await LeagueService.getLeaderBoard(this.props.match.params.leagueId)

    this.setState({ players, leagueId: this.props.id })
  }

  background(i) {
    switch (i) {
      case 0:
        return 'gold'
      case 1:
        return 'silver'
      case 2:
        return '#CD7F32'
      default:
    }
  }

  color(i) {
    if (i < 3) {
      return '#202020'
    }

    return 'white'
  }

  render() {
    if (this.props.id !== this.state.leagueId) {
        this.componentDidMount()
    }

    return (
      <div class="page">
        <div class="box-header">Výsledková listina</div>
        <table>
            <tbody><tr>
                <th width="5%"></th>
                <th width="55%" align="left">NAME</th>
                <th width="20%">POINTS</th>
                <th width="20%">PRICE</th>
            </tr>
            {this.state.players && this.state.players.map((player, i) => (
              <tr>
                <td align="left" style={{ background: this.background(i), color: this.color(i) }}>
                  {i+1}.
                </td>
                <td align="left">{player.firstName} {player.lastName}</td>
                <td><b>{player.totalPoints}</b></td>
                <td></td>
              </tr>
          ))}
        </tbody>
        </table>
      </div>
    )
  }
}
