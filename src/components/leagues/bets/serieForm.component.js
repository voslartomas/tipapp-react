import React, { Component } from 'react'
import { Header, Form, Input, Button } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { Redirect } from 'react-router-dom'
import TeamService from '../../../services/team.service'
import BetsSerieService from '../../../services/betsSerie.service'
import SpecialBetSerieService from '../../../services/specialBetSerie.service'

export default class SerieFormComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      serie: {},
      specialBetSerieTypeOptions: [],
      teamsOptions: [],
      redirect: undefined,
    }
  }

  async componentDidMount() {
    const { serieId, leagueId } = this.props.match.params
    let serie = {
      leagueId,
    }

    if (serieId !== 'new') {
      try {
        serie = await BetsSerieService.getById(leagueId, serieId)
        serie.dateTime = moment(serie.dateTime)
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

    const betSeries = await SpecialBetSerieService.getAll()
    const betSeriesOptions = betSeries.map(betSerie => ({
      key: betSerie.id,
      text: betSerie.name,
      value: betSerie.id,
    }))

    this.setState({
      teamsOptions,
      betSeriesOptions,
      serie,
    })
  }

  async saveForm() {
    if (this.state.serie.id) {
      await BetsSerieService.update(this.props.match.params.leagueId, this.state.serie, this.state.serie.id)
    } else {
      await BetsSerieService.create(this.props.match.params.leagueId, this.state.serie)
    }

    this.setState({
      redirect: `/leagues/${this.state.serie.leagueId}/bets/serie`,
    })
  }

  render() {
    const { redirect } = this.state

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    return (
      <div>
        <Header as="h1">Přidat/Upravit sérii</Header>
        <Form onSubmit={() => this.saveForm()}>
          <Form.Field>
            <Form.Select
              fluid
              required
              label="Domácí"
              options={this.state.teamsOptions}
              value={this.state.serie.homeTeamId}
              placeholder="Vyberte tým"
              onChange={(event, { name, value }) => {
                this.setState({ serie: { ...this.state.serie, homeTeamId: value } })
              }}
            />
          </Form.Field>
          <Form.Field>
            <Form.Select
              fluid
              required
              label="Hosté"
              options={this.state.teamsOptions}
              value={this.state.serie.awayTeamId}
              placeholder="Vyberte tým"
              onChange={(event, { name, value }) => {
                this.setState({ serie: { ...this.state.serie, awayTeamId: value } })
              }}
            />
          </Form.Field>
          <Form.Field>
            <Form.Select
              fluid
              required
              label="Typ"
              options={this.state.betSeriesOptions}
              value={this.state.serie.specialBetSerieId}
              placeholder="Vyberte typ"
              onChange={(event, { name, value }) => {
                this.setState({ serie: { ...this.state.serie, specialBetSerieId: value } })
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>Skóre domácí</label>
            <Input
              placeholder="Skóre domácí"
              value={this.state.serie.homeTeamScore}
              onChange={event => this.setState({ serie: { ...this.state.serie, homeTeamScore: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <label>Skóre hosté</label>
            <Input
              placeholder="Skóre hosté"
              value={this.state.serie.awayTeamScore}
              onChange={event => this.setState({ serie: { ...this.state.serie, awayTeamScore: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <label>Vyberte datum a čas</label>
            <DatePicker
              selected={this.state.serie.dateTime}
              onChange={event => this.setState({ serie: { ...this.state.serie, dateTime: event } })}
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
