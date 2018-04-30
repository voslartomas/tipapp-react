import React, { Component } from 'react'
import { Menu, Segment, Sidebar, Icon, Header, Card, Button, Form } from 'semantic-ui-react'
import { Route, Link } from 'react-router-dom'
import moment from 'moment'
import MatchService from '../../../services/match.service'
import LeagueService from '../../../services/league.service'
import UserBetsMatchService from '../../../services/userBetsMatch.service'
import PlayerService from '../../../services/player.service'

export default class MatchBetsComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      matchBets: [],
      leagueId: undefined,
      players: []
    }
  }

  async componentDidMount() {
    await this.loadBets()
  }

  async loadPlayers(match) {
    const players = await PlayerService.getPlayersByTeams(this.props.match.params.leagueId, match)
    console.log(players)
    const playersOptions = players.map(player => ({
      key: player.id,
      text: `${player.player.firstName} ${player.player.lastName} ${player.leagueTeam.team.shortcut}`,
      value: player.id,
    }))

    return playersOptions
  }

  async loadBets() {
    const matches = await LeagueService.getBetsMatches(this.props.match.params.leagueId)

    const players = []
    for (const match of matches) {
      if (this.canBet(match)) {
        const a = await this.loadPlayers(match)
        players[match.matchId1] = a
      }
    }

    this.setState({ matchBets: matches, leagueId: this.props.id, players })
  }

  getPlayers(matchId) {
    return this.state.players[matchId] || []
  }

  async handleBetChange(bet, event, scorerId = undefined) {
    if (!scorerId) {
      scorerId = bet.scorerId;
    }

    await UserBetsMatchService.put(this.props.match.params.leagueId, {matchId: bet.matchId1,
      homeScore: event.target.name === 'homeScore' ? parseInt(event.target.value) : bet.homeScore || 0,
      awayScore: event.target.name === 'awayScore' ? parseInt(event.target.value) : bet.awayScore || 0,
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

  render() {
    if (this.props.id !== this.state.leagueId) {
        // this.componentDidMount()
    }

    return (
      <div>
        <h1>Zápasy</h1>
        <Card.Group>
          {this.state.matchBets.map(bet => (
            <Card style={{width: '650px'}}>
              <Card.Content style={{}}>
                {bet.matchHomeScore !== null && bet.matchAwayScore !== null &&
                <div>
                {moment(bet.matchDateTime).format('D.M.Y h:mm')}<br />
                {moment(bet.matchDateTime).fromNow()}<br />
                {bet.homeTeam} {bet.matchHomeScore}<br />
                {bet.awayTeam} {bet.matchAwayScore}<br />
                {this.betPlaced(bet) && !this.canBet(bet) && <span style={{ color: this.betCorrect(bet) ? 'green' : 'red' }}>Tip {bet.homeScore}:{bet.awayScore}, {bet.scorer}</span>}
                </div>}

                {this.canBet(bet) && <div>
                  <input value={bet.homeScore || 0} type="number" name="homeScore" min="0" style={{ width: '35px' }} onChange={e => this.handleBetChange(bet, e)} />
                    {bet.homeTeam} vs {bet.awayTeam}
                  <input value={bet.awayScore || 0} type="number" name="awayScore" min="0" style={{ width: '35px' }} onChange={e => this.handleBetChange(bet, e)} />
                  <Form.Field>
                    {<Form.Select
                      fluid
                      required
                      label="Střelec"
                      search
                      value={bet.scorerId}
                      options={this.getPlayers(bet.matchId1)}
                      placeholder="Vyberte hráče"
                      onChange={(e, { name, value }) => {
                        this.handleBetChange(bet, e, value)
                      }}
                    />}
                  </Form.Field>
                </div>}
                {this.betPlaced(bet) && bet.totalPoints}
                {!this.betPlaced(bet) && <span>Nevsazeno</span>}
              </Card.Content>
            </Card>))}
        </Card.Group>
      </div>
    )
  }
}
