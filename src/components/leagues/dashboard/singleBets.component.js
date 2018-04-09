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
      serieBets: [],
      inputSingleBets: {},
      playersOptions: [],
      teamsOptions: [],
    }
  }

  async componentDidMount() {
    const players = await PlayerService.getPlayers(this.props.match.params.leagueId)
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
    })
    this.loadBets()
  }

  async loadBets() {
    const bets = await BetsSingleService.getAll(this.props.match.params.leagueId)
    const userBets = await UserBetsSingleService.getAll(this.props.match.params.leagueId)

    const inputSingleBets = []
    userBets.forEach((userBet) => {
      inputSingleBets[userBet.leagueSpecialBetSingleId] = {
        leagueSpecialBetSingleId: userBet.leagueSpecialBetSingleId,
        homeTeamScore: userBet.homeTeamScore,
        awayTeamScore: userBet.awayTeamScore,
      }
    })

    this.setState({ serieBets: bets, userSingleBets: userBets, inputSingleBets })
  }

  handleSingleBetChange(id, event) {
    let defaultHome,
      defaultAway = 0
    if (this.state.inputSingleBets[id]) {
      defaultHome = this.state.inputSingleBets[id].homeTeamScore
      defaultAway = this.state.inputSingleBets[id].awayTeamScore
    }

    this.setState({
      inputSingleBets: Object.assign(this.state.inputSingleBets, {
        [id]: {
          leagueSpecialBetSingleId: id,
          homeTeamScore: event.target.name === 'homeTeamScore' ? parseInt(event.target.value) : defaultHome,
          awayTeamScore: event.target.name === 'awayTeamScore' ? parseInt(event.target.value) : defaultAway,
        },
      }),
    })
  }

  submitSingleBet(id) {
    if (this.state.inputSingleBets[id]) {
      UserBetsSingleService.put(this.props.match.params.leagueId, this.state.inputSingleBets[id])
      this.loadBets()
    }
  }

  getResult(bet) {
    if (bet.specialBetValue) {
      return bet.specialBetValue
    } else if (bet.specialBetPlayerResult) {
      return `${bet.specialBetPlayerResult.player.firstName} ${bet.specialBetPlayerResult.player.lastName}`
    } else if (bet.specialBetTeamResult) {
      return bet.specialBetTeamResult.team.name
    }
    return undefined
  }

  betTipped(bet) {
    return this.state.inputSingleBets[bet.id]
  }

  betCorrect(bet) {
    if (this.betTipped(bet)) {
      return this.state.inputSingleBets[bet.id].homeTeamScore == bet.homeTeamScore &&
        this.state.inputSingleBets[bet.id].awayTeamScore == bet.awayTeamScore
    }

    return false
  }

  render() {
    return (
      <div>
        <h1>Single</h1>
        <Card.Group>
          {this.state.serieBets.map(bet => (<Card>
            <Card.Content>
              {bet.specialBetSingle.name} {this.getResult(bet) && this.getResult(bet)}
              {!this.getResult(bet) && <div>

                {bet.specialBetSingle.specialBetType === 1 && <Form.Field>
                  <Form.Select
                    fluid
                    required
                    label="Hráč"
                    options={this.state.playersOptions}
                    placeholder="Vyberte hráče"
                    onChange={(event, { name, value }) => {

                    }}
                  />
                </Form.Field>}
                {bet.specialBetSingle.specialBetType === 2 &&
                  <Form.Field>
                    <Form.Select
                      fluid
                      required
                      label="Tým"
                      options={this.state.teamsOptions}
                      placeholder="Vyberte tým"
                      onChange={(event, { name, value }) => {

                      }}
                    />
                  </Form.Field>}
                {bet.specialBetSingle.specialBetType === 3 && <span>
                  <input type="text" />
                </span>}

                <Button onClick={() => this.submitSingleBet(bet.id)}>Uložit sázku</Button>
              </div>}

            </Card.Content>
          </Card>))}
        </Card.Group>
      </div>
    )
  }
}
