import React, { Component } from 'react'
import LeagueService from '../../services/league.service'
import SportService from '../../services/sport.service'
import { Card, Header, Form, Checkbox, Button } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'

export default class LeagueFormComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      league: {},
      sportsOptions: [],
      redirect: undefined,
    }
  }

  async componentDidMount() {
    const leagueId = this.props.match.params.leagueId
    let league = {}
    if (leagueId !== 'new') {
      league = await LeagueService.getLeagueById(leagueId)
    }

    const sports = await SportService.getSports()
    const sportsOptions = sports.map(sport => ({
      key: sport.id,
      text: sport.czName,
      value: sport.id,
    }))

    this.setState({
      sportsOptions,
      league,
    })
  }

  async saveForm() {
    if (this.state.league.id) {
      await LeagueService.update(this.state.league, this.state.league.id)
    } else {
      await LeagueService.create(this.state.league)
    }

    this.setState({
      redirect: `/leagues/${this.state.league.sportId}`,
    })
  }

  render() {
    const { redirect } = this.state

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    return (
      <div>
        <Header as="h1">Přidat/Upravit ligu</Header>
        <Form onSubmit={this.saveForm}>
          <Form.Field>
            <label>Název</label>
            <input
              required
              placeholder="Název ligy"
              value={this.state.league.name}
              onChange={event => this.setState({ league: { ...this.state.league, name: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <label>Sezóna od</label>
            <input
              placeholder="Sezóna od"
              value={this.state.league.seasonFrom}
              onChange={event => this.setState({ league: { ...this.state.league, seasonFrom: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <label>Sezóna do</label>
            <input
              placeholder="Sezóna do"
              value={this.state.league.seasonTo}
              onChange={event => this.setState({ league: { ...this.state.league, seasonTo: event.target.value } })}
            />
          </Form.Field>
          <Form.Field>
            <Form.Select
              fluid
              label="Sport"
              options={this.state.sportsOptions}
              value={this.state.league.sportId}
              placeholder="Vyberte sport"
              onChange={(event, { name, value }) => {
                this.setState({ league: { ...this.state.league, sportId: value } })
              }}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="Aktivní"
              checked={this.state.league.isActive}
              onChange={() => this.setState({ league: { ...this.state.league, isActive: !this.state.league.isActive } })}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="Dokončená"
              checked={this.state.league.isFinished}
              onChange={() => this.setState({ league: { ...this.state.league, isFinished: !this.state.league.isFinished } })}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              label="Nejvíce aktivní"
              checked={this.state.league.isMostActive}
              onChange={() => this.setState({ league: { ...this.state.league, isMostActive: !this.state.league.isMostActive } })}
            />
          </Form.Field>
          <Button type="submit">Potvrdit změny</Button>
        </Form>
      </div>
    )
  }
}
