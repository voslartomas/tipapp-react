import React, { Component } from 'react'
import { Menu, Segment, Icon, Header } from 'semantic-ui-react'
import SportsComponent from './sports/sports.component'
import { Route, Link, Redirect } from 'react-router-dom'
import LeaguesMenuComponent from './leagues/leaguesMenu.component'
import LeaguesComponent from './leagues/leagues.component'
import LeagueDashboardComponent from './leagues/dashboard/leagueDashboard.component'
import LeagueFormComponent from './leagues/leagueForm.component'
import SportFormComponent from './sports/sportForm.component'
import TeamFormComponent from './teams/teamForm.component';
import PlayerFormComponent from './players/playerForm.component';
import LeagueService from '../services/league.service'
import { Form } from 'semantic-ui-react'

export default class SelectLeagueComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      leagues: [],
      league: undefined
    }
  }

  componentDidMount() {
    this.loadLeagues()
  }

  async loadLeagues() {
    const leagues = await LeagueService.getActiveLeagues()
    let selectedLeague = undefined
    let redirect = undefined

    const leaguesOptions = leagues.map(league => {
      if (league.league.isTheMostActive) {
        selectedLeague = league.league.id
        if (window.location.pathname === '/dashboard') redirect = `/dashboard/${league.league.id}`
      }
      return ({
        key: league.league.id,
        text: league.league.name,
        value: league.league.id,
      })
    })

    this.setState({ leagues: leaguesOptions, league: selectedLeague, redirect })
  }

  render() {

    const { redirect } = this.state

    if (redirect) {
      const t = redirect
      this.setState({redirect: undefined})
      return <Redirect to={redirect} />
    }

    return (
        <Form.Select style={{backgroundColor: '#202020', color: 'white', float: 'right'}}
          fluid
          options={this.state.leagues}
          value={this.state.league}
          onChange={(event, { name, value }) => {
            this.setState({ league: value, redirect: `/dashboard/${value}` })
          }}
        />
    )
  }
}
