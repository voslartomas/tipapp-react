import React, { Component } from 'react'
import { Menu, Segment, Sidebar, Icon, Header, Card, Button, Form } from 'semantic-ui-react'
import { Route, Link } from 'react-router-dom'
import BetsSingleService from '../../../services/betsSingle.service'
import UserBetsSingleService from '../../../services/userBetsSingle.service'
import PlayerService from '../../../services/player.service'
import LeagueService from '../../../services/league.service'

export default class SingleBetsComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      singleBets: [],
      userBets: {},
      playersOptions: [],
      teamsOptions: [],
      leagueId: undefined
    }
  }

  async componentDidMount() {
    const players = await PlayerService.getPlayers(this.props.match.params.leagueId, [])
    const teams = await LeagueService.getTeams(this.props.match.params.leagueId)

    const playersOptions = players.map(player => ({
      key: player.id,
      text: `${player.player.firstName} ${player.player.lastName}`,
      value: player.id,
    }))

    const teamsOptions = teams.map(team => ({
      key: team.id,
      text: team.team.name,
      value: team.id,
    }))

    this.setState({
      playersOptions,
      teamsOptions,
      leagueId: this.props.id
    })
    this.loadBets()
  }

  async loadBets() {
    const bets = await BetsSingleService.getAll(this.props.match.params.leagueId)

    this.setState({ singleBets: bets })
  }

  getResult(bet) {
    if (bet.valueBet) {
      return bet.valueBet
    } else if (bet.playerBet) {
      return `${bet.playerBet}`
    } else if (bet.teamBet) {
      return bet.teamBet
    }
  }

  betPlaced(bet) {
    return bet.betId
  }

  betCorrect(bet) {
    if (this.betPlaced(bet)) {
      return this.state.inputSingleBets[bet.id].homeTeamScore == bet.homeTeamScore &&
        this.state.inputSingleBets[bet.id].awayTeamScore == bet.awayTeamScore
    }

    return false
  }

  async submitBet(bet) {
    const value = this.state.userBets[bet.singleId]

    if (value) {
      let data = {
        leagueSpecialBetSingleId: bet.singleId
      }

      if (bet.type === 1) {
        data['playerResultId'] = value
      } else if (bet.type === 2) {
        data['teamResultId'] = value
      } else if (bet.type === 3) {
        data['value'] = value
      }

      await UserBetsSingleService.put(this.props.match.params.leagueId, data)
      this.loadBets()
    }
  }

  canBet(bet) {
    return new Date(bet.endDate).getTime() > new Date().getTime()
  }

  handleChange(bet, value) {
    const userBets = this.state.userBets
    userBets[bet.singleId] = value
    this.setState({ userBets })
  }

  render() {
    if (this.props.id !== this.state.leagueId) {
        this.componentDidMount()
    }

    return (
      <div class="page">
        <div class="box-header">Speciální</div>
        <table>
          <tr>
              <th width="40%" align="left">Název</th>
              <th width="10%">Výsledek</th>
              <th width="10%">Tip</th>
              <th width="10%">Body</th>
          </tr>
          {this.state.singleBets.map(bet => (
            <tr>
                <td align="left">{bet.name}</td>
                <td>
                  {bet.team && bet.team}
                  {bet.player && bet.player}
                  {bet.value && bet.value}
                </td>
                <td>
                {this.getResult(bet)}
                {this.canBet(bet) && <div>
                  {bet.type === 1 && <Form.Field>
                    <Form.Select
                      fluid
                      required
                      onChange={(e, { name, value }) => this.handleChange(bet, value)}
                      label="Hráč"
                      search
                      options={this.state.playersOptions}
                      placeholder="Vyberte hráče"
                    />
                  </Form.Field>}
                  {bet.type === 2 &&
                    <Form.Field>
                      <Form.Select
                        fluid
                        required
                        label="Tým"
                        onChange={(e, { name, value }) => this.handleChange(bet, value)}
                        search
                        options={this.state.teamsOptions}
                        placeholder="Vyberte tým"
                      />
                    </Form.Field>}
                  {bet.type === 3 && <span>
                    <input onChange={(e) => this.handleChange(bet, e.target.value)} type="text" />
                  </span>}
                  <Button onClick={(e) => this.submitBet(bet)}>Uložit sázku</Button>
                  </div>}
                </td>
                <td><b>{this.betPlaced(bet) && this.betPlaced(bet).totalPoints}</b></td>
            </tr>
          ))}
        </table>
      </div>
    )
  }
}
