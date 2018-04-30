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
      inputSingleBets: {},
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
    const userBets = await UserBetsSingleService.getAll(this.props.match.params.leagueId)

    const inputSingleBets = []
    userBets.forEach((userBet) => {
      inputSingleBets[userBet.leagueSpecialBetSingleId] = {
        leagueSpecialBetSingleId: userBet.leagueSpecialBetSingleId,
        result: userBet
      }
    })

    this.setState({ singleBets: bets, userSingleBets: userBets, inputSingleBets })
  }

  handleSingleBetChange(bet, value) {
    this.setState({
      inputSingleBets: Object.assign(this.state.inputSingleBets, {
        [bet.id]: {
          value,
          bet,
        },
      }),
    })
  }

  submitSingleBet(id) {
    const userBet = this.state.inputSingleBets[id]
    if (userBet) {
      let data = {
        leagueSpecialBetSingleId: userBet.bet.id
      }

      if (userBet.bet.specialBetSingle.specialBetType === 1) {
        data['playerResultId'] = userBet.value
      } else if (userBet.bet.specialBetSingle.specialBetType === 2) {
        data['teamResultId'] = userBet.value
      } else {
        data['value'] = userBet.value
      }

      UserBetsSingleService.put(this.props.match.params.leagueId, data)
      this.loadBets()
    }
  }

  getResult(bet) {
    if (!this.state.inputSingleBets[bet.id]) {
      return undefined
    }
    const userBet = this.state.inputSingleBets[bet.id]

    if (!userBet.result) {
      return undefined
    }

    if (userBet.result.value) {
      return userBet.result.value
    } else if (userBet.result.playerResult) {
      return `${userBet.result.playerResult.player.firstName} ${userBet.result.playerResult.player.lastName}`
    } else if (userBet.result.teamResult) {
      return userBet.result.teamResult.team.name
    }
  }

  betPlaced(bet) {
    return this.state.inputSingleBets[bet.id]
  }

  betCorrect(bet) {
    if (this.betPlaced(bet)) {
      return this.state.inputSingleBets[bet.id].homeTeamScore == bet.homeTeamScore &&
        this.state.inputSingleBets[bet.id].awayTeamScore == bet.awayTeamScore
    }

    return false
  }

  render() {
    if (this.props.id !== this.state.leagueId) {
        this.componentDidMount()
    }

    return (
      <div>
        <h1>Single</h1>
        <Card.Group>
          {this.state.singleBets.map(bet => (<Card>
            <Card.Content>
              {bet.specialBetSingle.name} {this.getResult(bet) && this.getResult(bet)}
              {!this.getResult(bet) && <div>
                {bet.specialBetSingle.specialBetType === 1 && <Form.Field>
                  <Form.Select
                    fluid
                    required
                    label="Hráč"
                    search
                    options={this.state.playersOptions}
                    placeholder="Vyberte hráče"
                    onChange={(e, { name, value }) => {
                      this.handleSingleBetChange(bet, value)
                    }}
                  />
                </Form.Field>}
                {bet.specialBetSingle.specialBetType === 2 &&
                  <Form.Field>
                    <Form.Select
                      fluid
                      required
                      label="Tým"
                      search
                      options={this.state.teamsOptions}
                      placeholder="Vyberte tým"
                      onChange={(e, { name, value }) => {
                        this.handleSingleBetChange(bet, value)
                      }}
                    />
                  </Form.Field>}
                {bet.specialBetSingle.specialBetType === 3 && <span>
                  <input onChange={(e) => {
                    this.handleSingleBetChange(bet, e.target.value)
                  }} type="text" />
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
