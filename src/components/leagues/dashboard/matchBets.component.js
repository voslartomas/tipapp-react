import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import moment from 'moment'
import LeagueService from '../../../services/league.service'
import UserBetsMatchService from '../../../services/userBetsMatch.service'
import PlayerService from '../../../services/player.service'

export default class MatchBetsComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      matchBets: [],
      leagueId: undefined,
      players: [],
      history: false
    }
  }

  async componentDidMount() {
    await this.loadBets()
  }

  async loadBets() {
    let matches
    if (this.state.history) {
      matches = await LeagueService.getBetsMatchesHistory(this.props.match.params.leagueId)
    } else {
      matches = await LeagueService.getBetsMatches(this.props.match.params.leagueId)
    }

    const teams = []
    for (const match of matches) {
      if (this.canBet(match)) {
        teams.push(match.awayTeamId, match.homeTeamId)
      }
    }

    const players = await PlayerService.getPlayersByTeams(this.props.match.params.leagueId, teams)

    this.setState({ matchBets: matches, leagueId: this.props.id, players })
  }

  getPlayers(match) {
    return this.state.players.filter(player => player.leagueTeamId === match.homeTeamId || player.leagueTeamId === match.awayTeamId)
      .map(player => ({
      key: player.id,
      text: `${player.player.firstName} ${player.player.lastName} ${player.leagueTeam.team.shortcut}`,
      value: player.id,
    }))
  }

  async handleBetChange(bet, value, type, scorerId = undefined) {
    if (!scorerId) {
      scorerId = bet.scorerId;
    }

    await UserBetsMatchService.put(this.props.match.params.leagueId, {matchId: bet.matchId1,
      homeScore: type === 'homeScore' ? parseInt(value) : bet.homeScore || 0,
      awayScore: type === 'awayScore' ? parseInt(value) : bet.awayScore || 0,
      overtime: type === 'overtime' ? value: bet.overtime || false,
      scorerId}, bet.id)

    await this.loadBets()
  }

  betPlaced(bet) {
    return bet.id
  }

  betCorrect(bet) {
    const userBet = this.betPlaced(bet)
    if (userBet) {
      return userBet.correctBet
    }

    return false
  }

  canBet(bet) {
    return new Date(bet.matchDateTime).getTime() > new Date().getTime()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.history !== this.state.history) {
      this.loadBets()
    }
  }

  toggleHistory() {
    this.setState({ history: !this.state.history })
  }

  render() {
    return (
      <div class="page">
      <div class="box-header">Zápasy</div>

      {!this.state.history && <span onClick={() => { this.toggleHistory() }}>Zobrazit historii</span>}
      {this.state.history && <span onClick={() => { this.toggleHistory() }}>Zobrazit nadcházející</span>}

      <table>
        <tbody>
          <tr>
              <th width="40%" align="left">Zápas</th>
              <th width="10%">Datum</th>
              <th width="10%">Výsledek</th>
              <th width="10%">Tip</th>
              <th width="20%">Střelec</th>
              <th width="10%">Body</th>
          </tr>
        {this.state.matchBets.map(bet => (
        <tr>
            <td align="left">{bet.homeTeam} - {bet.awayTeam}</td>
            <td>{moment(bet.matchDateTime).fromNow()}</td>
            <td>{bet.matchHomeScore}:{bet.matchAwayScore}{bet.matchOvertime ? 'P' : ''}</td>
            <td>{!this.canBet(bet) && <div>{bet.homeScore}:{bet.awayScore}</div>}
            {this.canBet(bet) && <div>
              <input value={bet.homeScore || 0} type="number" name="homeScore" min="0" style={{ width: '35px' }} onChange={e => this.handleBetChange(bet, e.target.value, 'homeScore')} />:
              <input value={bet.awayScore || 0} type="number" name="awayScore" min="0" style={{ width: '35px' }} onChange={e => this.handleBetChange(bet, e.target.value, 'awayScore')} />
              <input type="checkbox" title="Prodloužení" checked={bet.overtime} onChange={e => this.handleBetChange(bet, e.target.checked, 'overtime')} />
            </div>}
            </td>
            <td>{!this.canBet(bet) && <span>{bet.scorer}</span>}
            {this.canBet(bet) && <Form.Field>
              {<Form.Select
                fluid
                required
                search
                value={bet.scorerId}
                options={this.getPlayers(bet)}
                placeholder="Vyberte hráče"
                onChange={(e, { name, value }) => {
                  this.handleBetChange(bet, e, 'scorer', value)
                }}
              />}
            </Form.Field>}
            </td>
            <td><b>{bet.totalPoints}</b></td>
        </tr>
          ))}
        </tbody>
        </table>
      </div>
    )
  }
}
