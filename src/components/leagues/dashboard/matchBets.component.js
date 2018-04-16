import React, { Component } from 'react'
import { Menu, Segment, Sidebar, Icon, Header, Card, Button, Form } from 'semantic-ui-react'
import { Route, Link } from 'react-router-dom'
import moment from 'moment'
import MatchService from '../../../services/match.service'
import UserBetsMatchService from '../../../services/userBetsMatch.service'
import PlayerService from '../../../services/player.service'

export default class MatchBetsComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      matchBets: [],
      inputBets: {},
    }
  }

  async componentDidMount() {
    const players = await PlayerService.getPlayers(this.props.match.params.leagueId)

    const playersOptions = players.map(player => ({
      key: player.id,
      text: `${player.player.firstName} ${player.player.lastName}`,
      value: player.id,
    }))

    this.setState({
      playersOptions
    })

    this.loadBets()
  }

  async loadBets() {
    const bets = await MatchService.getMatches(this.props.match.params.leagueId)
    const userBets = await UserBetsMatchService.getAll(this.props.match.params.leagueId)

    const inputBets = []
    userBets.forEach((userBet) => {
      inputBets[userBet.matchId] = {
        matchId: userBet.matchId,
        homeScore: userBet.homeScore,
        awayScore: userBet.awayScore,
        scorerId: userBet.scorerId,
      }
    })

    this.setState({ matchBets: bets, userMatchBets: userBets, inputBets })
  }

  handleBetChange(id, event, scorerId = undefined) {
    let defaultHome,
      defaultAway = 0
    if (this.state.inputBets[id]) {
      defaultHome = this.state.inputBets[id].homeScore
      defaultAway = this.state.inputBets[id].awayScore
    }

    if (!scorerId && this.state.inputBets[id]) {
      scorerId = this.state.inputBets[id].scorerId;
    }

    this.setState({
      inputBets: Object.assign(this.state.inputBets, {
        [id]: {
          matchId: id,
          homeScore: event.target.name === 'homeScore' ? parseInt(event.target.value) : defaultHome,
          awayScore: event.target.name === 'awayScore' ? parseInt(event.target.value) : defaultAway,
          scorerId
        },
      }),
    })
  }

  submitSerieBet(id) {
    if (this.state.inputBets[id]) {
      UserBetsMatchService.put(this.props.match.params.leagueId, this.state.inputBets[id])
      this.loadBets()
    }
  }

  betPlaced(bet) {
    return this.state.inputBets[bet.id]
  }

  betCorrect(bet) {
    const userBet = this.betPlaced(bet)
    if (userBet) {
      console.log('userBet', bet)
      return userBet.correctBet
    }

    return false
  }

  render() {
    console.log('bets', this.state.inputBets)
    return (
      <div>
        <h1>Zápasy</h1>
        <Card.Group>
          {this.state.matchBets.map(bet => (<Card>
            <Card.Content>
              {bet.homeScore > 0 && bet.awayScore > 0 &&
              <div><span>Výsledek {bet.homeTeam.team.name} {bet.homeScore}:{bet.awayScore} {bet.awayTeam.team.name} {moment(bet.dateTime).fromNow()}</span><br />
                {this.betPlaced(bet) && <span style={{ color: this.betCorrect(bet) ? 'green' : 'red' }}>Tip {this.state.inputBets[bet.id].homeScore}:{this.state.inputBets[bet.id].awayScore}</span>}
                {!this.betPlaced(bet) && <span>Nevsazeno</span>}
              </div>}

              {<div>
                <input value={(this.state.inputBets[bet.id] && this.state.inputBets[bet.id].homeScore) || 0} type="number" name="homeScore" min="0" style={{ width: '35px' }} onChange={e => this.handleBetChange(bet.id, e)} />
                  {bet.homeTeam.team.name} vs {bet.awayTeam.team.name}
                <input value={(this.state.inputBets[bet.id] && this.state.inputBets[bet.id].awayScore) || 0} type="number" name="awayScore" min="0" style={{ width: '35px' }} onChange={e => this.handleBetChange(bet.id, e)} />
                <Form.Field>
                  <Form.Select
                    fluid
                    required
                    label="Střelec"
                    search
                    value={this.state.inputBets[bet.id] && this.state.inputBets[bet.id].scorerId}
                    options={this.state.playersOptions}
                    placeholder="Vyberte hráče"
                    onChange={(e, { name, value }) => {
                      this.handleBetChange(bet.id, e, value)
                    }}
                  />
                </Form.Field>
                <Button onClick={() => this.submitSerieBet(bet.id)}>Uložit sázku</Button>
              </div>}
            </Card.Content>
          </Card>))}
        </Card.Group>
      </div>
    )
  }
}
