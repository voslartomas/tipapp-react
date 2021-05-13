import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
import LeagueService from '../services/league.service'
import SelectedLeagueContext from '../context/SelectedLeagueContext'

export default class SelectLeagueComponent extends Component {

  static contextType = SelectedLeagueContext;

  constructor(props) {
    super(props)

    this.state = {
      leagues: [],
      league: undefined,
    }
  }

  componentDidMount() {
    this.loadLeagues()
  }

  async loadLeagues() {
    const leagues = await LeagueService.getActiveLeagues()
    let selectedLeague
    let redirect

    const leaguesOptions = leagues.sort((a, b) => a.league.isTheMostActive - b.league.isTheMostActive || a.league.createdAt - b.league.createdAt)
      .map((league) => {
      if (league.league.isTheMostActive) {
        selectedLeague = league.league.id
        if (window.location.pathname === '/dashboard') redirect = `/dashboard/${league.league.id}/matches`
      }
      return ({
        key: league.league.id,
        text: league.league.name,
        value: league.league.id,
      })
    })

    try {
      const leagueIdFromUrl = Number(window.location.pathname.split('/dashboard/')[1].split('/')[0])
      selectedLeague = leagueIdFromUrl
    } catch (error) {}

    this.setState({ leagues: leaguesOptions, league: selectedLeague, redirect })
    this.context.setSelectedLeague(selectedLeague)
  }

  render() {
    const { redirect } = this.state

    if (redirect) {
      const t = redirect
      this.setState({ redirect: undefined })
      return <Redirect to={redirect} />
    }

    return (
      <React.Fragment>
        <Form.Select style={{backgroundColor: '#202020', color: 'white', float: 'right'}}
          fluid
          options={this.state.leagues}
          value={this.state.league}
          onChange={(event, { name, value }) => {
            this.context.setSelectedLeague(value)
            this.setState({ league: value, redirect: `/dashboard/${value}/matches` })
          }}
        />
      </React.Fragment>
    )
  }
}