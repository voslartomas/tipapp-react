import { Button, Card, Header, Icon, Menu, Segment, Sidebar } from 'semantic-ui-react'
import { Link, Route } from 'react-router-dom'
import React, { Component } from 'react'

import BetsSerieService from '../../../services/betsSerie.service'
import LeagueService from '../../../services/league.service'
import UserBetsSerieService from '../../../services/userBetsSerie.service'

export default class SerieBetsComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      serieBets: [],
      inputSerieBets: {},
      leagueId: undefined
    }
  }

  async componentDidMount() {
    this.loadBets()
  }

  async loadBets() {
    const userBets = await LeagueService.getBetsSeries(this.props.match.params.leagueId)

    this.setState({ serieBets: userBets, leagueId: this.props.id })
  }

  async submitSerieBet(bet) {
    await UserBetsSerieService.put(this.props.match.params.leagueId, {
      homeTeamScore: bet.homeTeamScore,
      awayTeamScore: bet.awayTeamScore,
      leagueSpecialBetSerieId: bet.leagueSpecialBetSerieId
    }, bet.id | 0)

    this.loadBets()
  }

  async handleBetChange(bet, event) {
    bet.homeTeamScore = event.target.name === 'homeScore' ? parseInt(event.target.value) : bet.homeTeamScore || 0
    bet.awayTeamScore = event.target.name === 'awayScore' ? parseInt(event.target.value) : bet.awayTeamScore || 0

    this.setState({ loading: false })
  }

  betPlaced(bet) {
    return bet.id
  }

  canBet(bet) {
    return new Date(bet.endDate).getTime() > new Date().getTime()
  }

  render() {
    if (this.props.id !== this.state.leagueId) {
        this.componentDidMount()
    }

    return (
      <div class="page">
      <div class="box-header">Série</div>
        <table>
          <tbody>
            <tr>
                <th width="40%" align="left">Zápas</th>
                <th width="10%">Výsledek</th>
                <th width="10%">Tip</th>
                <th width="10%">Body</th>
            </tr>
            {this.state.serieBets.map(bet => (
              <tr>
                <td align="left">{bet.homeTeam} - {bet.awayTeam}</td>
                <td>{bet.serieHomeScore}:{bet.serieAwayScore}</td>
                <td>
                  {this.betPlaced(bet) && <span>{bet.homeTeamScore}:{bet.awayTeamScore}</span>}
                  {this.canBet(bet) && <span>
                  <input
                    value={(bet.homeTeamScore) || 0}
                    type="number"
                    onChange={e => this.handleBetChange(bet, e)}
                    name="homeScore"
                    min="0"
                    max="4"
                    style={{ width: '35px' }} />:
                  <input
                    value={(bet.awayTeamScore) || 0}
                    type="number"
                    onChange={e => this.handleBetChange(bet, e)}
                    name="awayScore"
                    min="0"
                    max="4"
                    style={{ width: '35px' }} />
                  </span>}
                  {this.canBet(bet) && <Button onClick={() => this.submitSerieBet(bet)}>Uložit sázku</Button>}

                  </td>
                <td><b>{this.betPlaced(bet) && bet.totalPoints}</b></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
