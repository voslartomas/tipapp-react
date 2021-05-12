import React, { Component, useState } from 'react'
import { Form, Icon } from 'semantic-ui-react'
import moment from 'moment'
import LeagueService from '../../../services/league.service'
import UserBetsMatchService from '../../../services/userBetsMatch.service'
import PlayerService from '../../../services/player.service'

/* export default function MatchBetsComponent (props)  {

} */

export default class MatchBetsComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      matchBets: [],
      players: [],
      history: false,
      toggledGames: [],
      otherPeopleBets: [],
    }
  }

  async componentDidMount() {
    await this.loadBets()
  }

  getPlayers(match) {
    return this.state.players
      .filter(player => player.leagueTeamId === match.homeTeamId ||
        player.leagueTeamId === match.awayTeamId)
      .map(player => ({
        key: player.id,
        text: `${player.player.firstName} ${player.player.lastName}${this.addStarsForBestScorers(player)} ${player.leagueTeam.team.shortcut}`,
        value: player.id,
      }))
  }

  async loadBets() {
    const matches = this.state.history ? 
      await LeagueService.getBetsMatchesHistory(this.props.match.params.leagueId) :
      await LeagueService.getBetsMatches(this.props.match.params.leagueId);

    const teams = []
    for (const match of matches) {
      if (this.canBet(match)) {
        teams.push(match.awayTeamId, match.homeTeamId)
      }
    }

    const players = await PlayerService.getPlayersByTeams(this.props.match.params.leagueId, teams)

    this.setState({ matchBets: matches, leagueId: this.props.id, players })
  }

  async handleBetChange(bet, value, type, scorerId = undefined) {
    if (!scorerId) {
      scorerId = bet.scorerId;
    }

    await UserBetsMatchService.put(this.props.match.params.leagueId, {matchId: bet.matchId1,
      homeScore: type === 'homeScore' ? parseInt(value) : bet.homeScore || 0,
      awayScore: type === 'awayScore' ? parseInt(value) : bet.awayScore || 0,
      overtime: type === 'overtime' ? value : bet.overtime || false,
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

  isToggledGame(betId) {
    return this.state.toggledGames.includes(betId);
  }


  async loadOtherBets(bet) {
    await LeagueService.getUserBetsMatch(this.props.match.params.leagueId, bet.matchId).then(x => {

      

      this.setState({
        otherPeopleBets: this.state.otherPeopleBets.concat({
          matchId: bet.matchId,
          bets: x,
        }),
      })

    });
  }

  async onClickHandler(bet) {
    if (!this.isToggledGame(bet.id) &&
      !this.state.otherPeopleBets.find(x => x.matchId === bet.matchId)) {
      await this.loadOtherBets(bet)
    }
    this.setState({
        toggledGames: this.isToggledGame(bet.id) ? this.state.toggledGames.filter(x => x !== bet.id) : this.state.toggledGames.concat(bet.id),
    });
  }

  addStarsForBestScorers(player) {
    let stars = ''
    if (player.bestScorer) {
      return stars += ' *'
    }
    if (player.secondBestScorer) {
      return stars += ' **'
    }
    if (player.thirdBestScorer) {
      return stars += ' ***'
    }
    if (player.fourthBestScorer) {
      return stars += ' ****'
    }
    return stars
  }

  otherBets(bet) {
    const other = this.state.otherPeopleBets.find(x => x.matchId === bet.matchId)
    return (
      <React.Fragment>
        {other.bets.filter(y => y.leagueUserId !== bet.leagueUserId).map(b => (
          <tr key={b.id + "_1"}>
            <td>{`${b.user.user.firstName} ${b.user.user.lastName}`}</td>
            <td />
            <td />
            <td>{b.homeScore}:{b.awayScore}</td>
            <td>{`${b.scorer.player.firstName} ${b.scorer.player.lastName}`}</td>
            <td>{b.totalPoints}</td>
          </tr>
      ))}
      </React.Fragment>
    )
  }

  betRow(bet) {
    return (
      <tr key={bet.id} onClick={() => this.onClickHandler(bet)}>
        <td align="left">
          <Icon name={this.isToggledGame(bet.id) ? "angle up" : "angle down"} /> {bet.homeTeam} - {bet.awayTeam}
        </td>
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
    )
  }

  render() {
    return (
      <div className="page">
        {!this.state.history && 
          <span onClick={() => { this.toggleHistory() }}>Zobrazit historii</span>}
        {this.state.history && 
          <span onClick={() => { this.toggleHistory() }}>Zobrazit nadcházející</span>}
        <table>
          <tbody>
            <tr>
              <th width="35%">Zápas</th>
              <th width="13%">Datum</th>
              <th width="12%">Výsledek</th>
              <th width="12%">Tip</th>
              <th width="20%">Střelec</th>
              <th width="8%">Body</th>
            </tr>
            {this.state.matchBets.map(bet => (
              <React.Fragment key={bet.id}>
                {this.betRow(bet)}
                {this.isToggledGame(bet.id) && this.otherBets(bet)}
              </React.Fragment>
              ),
            )}
          </tbody>
        </table>
      </div>
    )
  }
}
