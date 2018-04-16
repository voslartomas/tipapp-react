import React, { Component } from 'react'
import { Menu, Segment, Sidebar, Icon, Header, Card, Button } from 'semantic-ui-react'
import { Route, Link } from 'react-router-dom'
import BetsSerieService from '../../../services/betsSerie.service'
import UserBetsSerieService from '../../../services/userBetsSerie.service'

export default class SerieBetsComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      serieBets: [],
      inputSerieBets: {},
    }
  }

  async componentDidMount() {
    this.loadBets()
  }

  async loadBets() {
    const bets = await BetsSerieService.getAll(this.props.match.params.leagueId)
    const userBets = await UserBetsSerieService.getAll(this.props.match.params.leagueId)

    const inputSerieBets = []
    userBets.forEach((userBet) => {
      inputSerieBets[userBet.leagueSpecialBetSerieId] = {
        leagueSpecialBetSerieId: userBet.leagueSpecialBetSerieId,
        homeTeamScore: userBet.homeTeamScore,
        awayTeamScore: userBet.awayTeamScore,
      }
    })

    this.setState({ serieBets: bets, userSerieBets: userBets, inputSerieBets })
  }

  handleSerieBetChange(id, event) {
    let defaultHome,
      defaultAway = 0
    if (this.state.inputSerieBets[id]) {
      defaultHome = this.state.inputSerieBets[id].homeTeamScore
      defaultAway = this.state.inputSerieBets[id].awayTeamScore
    }

    this.setState({
      inputSerieBets: Object.assign(this.state.inputSerieBets, {
        [id]: {
          leagueSpecialBetSerieId: id,
          homeTeamScore: event.target.name === 'homeTeamScore' ? parseInt(event.target.value) : defaultHome,
          awayTeamScore: event.target.name === 'awayTeamScore' ? parseInt(event.target.value) : defaultAway,
        },
      }),
    })
  }

  submitSerieBet(id) {
    if (this.state.inputSerieBets[id]) {
      UserBetsSerieService.put(this.props.match.params.leagueId, this.state.inputSerieBets[id])
      this.loadBets()
    }
  }

  betPlaced(bet) {
    return this.state.inputSerieBets[bet.id]
  }

  betCorrect(bet) {
    if (this.betPlaced(bet)) {
      return this.state.inputSerieBets[bet.id].homeTeamScore == bet.homeTeamScore &&
        this.state.inputSerieBets[bet.id].awayTeamScore == bet.awayTeamScore
    }

    return false
  }

  render() {
    return (
      <div>
        <h1>Serie</h1>
        <Card.Group>
          {this.state.serieBets.map(bet => (<Card>
            <Card.Content>
              {bet.homeTeamScore > 0 && bet.awayTeamScore > 0 &&
              <div><span>Výsledek {bet.homeTeam.team.name} {bet.homeTeamScore}:{bet.awayTeamScore} {bet.awayTeam.team.name}</span><br />
                {this.betPlaced(bet) && <span style={{ color: this.betCorrect(bet) ? 'green' : 'red' }}>Tip {this.state.inputSerieBets[bet.id].homeTeamScore}:{this.state.inputSerieBets[bet.id].awayTeamScore}</span>}
                {!this.betPlaced(bet) && <span>Nevsazeno</span>}
              </div>}

              {!bet.homeTeamScore && !bet.awayTeamScore &&
              <div>
                <input value={(this.state.inputSerieBets[bet.id] && this.state.inputSerieBets[bet.id].homeTeamScore) || 0} type="number" name="homeTeamScore" min="0" max="4" style={{ width: '35px' }} onChange={e => this.handleSerieBetChange(bet.id, e)} />
                  {bet.homeTeam.team.name} vs {bet.awayTeam.team.name}
                <input value={(this.state.inputSerieBets[bet.id] && this.state.inputSerieBets[bet.id].awayTeamScore) || 0} type="number" name="awayTeamScore" min="0" max="4" style={{ width: '35px' }} onChange={e => this.handleSerieBetChange(bet.id, e)} />
                <Button onClick={() => this.submitSerieBet(bet.id)}>Uložit sázku</Button>
              </div>}
            </Card.Content>
          </Card>))}
        </Card.Group>
      </div>
    )
  }
}
