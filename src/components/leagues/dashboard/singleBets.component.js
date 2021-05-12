import React, { Component } from 'react'
import { Menu, Segment, Sidebar, Icon, Header, Card, Button, Form } from 'semantic-ui-react'
import { Route, Link } from 'react-router-dom'
import moment from 'moment'
import UserBetsSingleService from '../../../services/userBetsSingle.service'
import PlayerService from '../../../services/player.service'
import LeagueService from '../../../services/league.service'

export default class SingleBetsComponent extends Component {
  constructor(props) {
    super(props)

    this.userBets = {}
    this.state = {
      singleBets: [],
      playersOptions: [],
      teamsOptions: [],
      leagueId: undefined,
      toggledBets: [],
      otherPeopleBets: [],
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
    const bets = await UserBetsSingleService.getAll(this.props.match.params.leagueId)

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
    return bet.id
  }

  async submitBet(bet) {
    const value = this.userBets[bet.singleId]

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

      await UserBetsSingleService.put(this.props.match.params.leagueId, data, bet.id | 0)
      this.loadBets()
    }
  }

  canBet(bet) {
    return new Date(bet.endDate).getTime() > new Date().getTime()
  }

  handleChange(bet, value) {
    const userBets = this.state.userBets
    this.userBets[bet.singleId] = value
  }

  isToggledBet(betId) {
    return this.state.toggledBets.includes(betId);
  }

  async loadOtherBets(bet) {
    await LeagueService.getUserBetsSingle(this.props.match.params.leagueId, bet.leagueSpecialBetSingleId).then(x => {

      this.setState({
        otherPeopleBets: this.state.otherPeopleBets.concat({
          betId: bet.betId,
          bets: x,
        }),
      })

    });
  }

  async onClickHandler(bet) {
    if (!this.isToggledBet(bet.id) &&
      !this.state.otherPeopleBets.find(x => x.betId === bet.betId)) {
      await this.loadOtherBets(bet)
    }
    this.setState({
        toggledBets: this.isToggledBet(bet.id) ? this.state.toggledBets.filter(x => x !== bet.id) : this.state.toggledBets.concat(bet.id),
    });
  }

  otherBets(bet) {
    const other = this.state.otherPeopleBets.find(x => x.betId === bet.betId)




    return (
      <React.Fragment>
         {other.bets.filter(y => y.leagueUserId !== bet.leagueUserId).map((b,index) => (
          <tr key={bet.id+index}>
            <td>{`${b.leagueUser.user.firstName} ${b.leagueUser.user.lastName}`}</td>
            <td></td>
            <td></td>
            <td>        {b.teamResult && b.teamResult.team.name}
        {b.playerResult && `${b.playerResult.player.firstName} ${b.playerResult.player.lastName}`}
        {b.value && b.value}</td>
            
            <td>{b.totalPoints}</td>
          </tr>
      ))}
      </React.Fragment>
    )
  }

  betRow(bet) {
    return (<tr onClick={() => this.onClickHandler(bet)}>
      <td align="left"><Icon name={this.isToggledBet(bet.id) ? "angle up" : "angle down"} />{bet.name}</td>
      <td>
        {bet.team && bet.team}
        {bet.player && bet.player}
        {bet.value && bet.value}
      </td>
      <td>{this.canBet(bet) && <span>Konec {moment(bet.endDate).fromNow()}</span>}</td>
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
      <td><b>{this.betPlaced(bet) && bet.totalPoints}</b></td>
  </tr>)
  }

  render() {
    if (this.props.id !== this.state.leagueId) {
        this.componentDidMount()
    }

    return (
      <div className="page">
        <table>
          <tbody>
          <tr>
              <th width="40%" align="left">Název</th>
              <th width="10%">Výsledek</th>
              <th width="10%">Datum</th>
              <th width="10%">Tip</th>
              <th width="10%">Body</th>
          </tr>
          {this.state.singleBets.map((bet) => (
              <React.Fragment key={bet.id}>
                {this.betRow(bet)}
                {this.isToggledBet(bet.id) && this.otherBets(bet)}
              </React.Fragment>
          ))}
          </tbody>
        </table>
      </div>
    )
  }
}
