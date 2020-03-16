import React, { Component } from 'react'
import { Header, Form, Input, Button } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { Redirect } from 'react-router-dom'
import TeamService from '../../../services/team.service'
import PlayerService from '../../../services/player.service'
import BetsSingleService from '../../../services/betsSingle.service'
import SpecialBetSingleService from '../../../services/specialBetSingle.service'

export default class SingleFormComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      single: {},
      betSinglesOptions: [],
      teamsOptions: [],
      playersOptions: [],
      redirect: undefined,
    }
  }

  async componentDidMount() {
    const { singleId, leagueId } = this.props.match.params
    let single = {
      leagueId,
    }

    if (singleId !== 'new') {
      try {
        single = await BetsSingleService.getById(leagueId, singleId)
        single.dateTime = moment(single.dateTime)
      } catch (e) {
        console.error(e)
      }
    }

    const teams = await TeamService.getTeams(leagueId)
    const teamsOptions = teams.map(leagueTeam => ({
      key: leagueTeam.id,
      text: leagueTeam.team.name,
      value: leagueTeam.id,
    }))

    const players = await PlayerService.getPlayers(leagueId)
    const playersOptions = players.map(leaguePlayer => ({
      key: leaguePlayer.id,
      text: `${leaguePlayer.player.firstName} ${leaguePlayer.player.lastName} ${leaguePlayer.leagueTeam.team.shortcut}`,
      value: leaguePlayer.id,
    }))

    const betSingles = await SpecialBetSingleService.getAll()
    const betSinglesOptions = betSingles.map(betSingle => ({
      key: betSingle.id,
      text: betSingle.name,
      value: betSingle.id,
    }))

    this.setState({
      teamsOptions,
      playersOptions,
      betSinglesOptions,
      single,
    })
  }

  async saveForm() {
    if (this.state.single.id) {
      await BetsSingleService.update(this.props.match.params.leagueId, this.state.single, this.state.single.id)
    } else {
      await BetsSingleService.create(this.props.match.params.leagueId, this.state.single)
    }

    this.setState({
      redirect: `/leagues/${this.state.single.leagueId}/bets/single`,
    })
  }

  render() {
    const { redirect } = this.state

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    return (
      <div>
        <Header as="h1">Přidat/Upravit single</Header>
        <Form onSubmit={() => this.saveForm()}>
          <Form.Field>
            <Form.Select
              fluid
              required
              label="Typ"
              options={this.state.betSinglesOptions}
              value={this.state.single.specialBetSingleId}
              placeholder="Vyberte typ"
              onChange={(event, { name, value }) => {
                this.setState({ single: { ...this.state.single, specialBetSingleId: value } })
              }}
            />
          </Form.Field>
          <Form.Field>
            <Form.Select
              fluid
              required
              label="Tým"
              options={this.state.teamsOptions}
              value={this.state.single.specialBetTeamResultId}
              placeholder="Vyberte tým"
              onChange={(event, { name, value }) => {
                this.setState({ single: { ...this.state.single, specialBetTeamResultId: value } })
              }}
            />
          </Form.Field>
          <Form.Field>
            <Form.Select
              fluid
              required
              label="Hráč"
              options={this.state.playersOptions}
              value={this.state.single.specialBetPlayerResultId}
              placeholder="Vyberte Hráče"
              onChange={(event, { name, value }) => {
                this.setState({ single: { ...this.state.single, specialBetPlayerResultId: value } })
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>Hodnota</label>
            <Input
              placeholder="Hodnota"
              value={this.state.single.specialBetValue}
              onChange={event => this.setState({ single: { ...this.state.single, specialBetValue: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <label>Body</label>
            <Input
              placeholder="Body"
              value={this.state.single.points}
              onChange={event => this.setState({ single: { ...this.state.single, points: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <label>Vyberte datum a čas</label>
            <DatePicker
              selected={this.state.single.dateTime}
              onChange={event => this.setState({ single: { ...this.state.single, dateTime: event } })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="LLL"
              timeCaption="time"
            />
          </Form.Field>
          <Button type="submit">Potvrdit změny</Button>
        </Form>
      </div>
    )
  }
}
