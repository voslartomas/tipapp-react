import React, { Component } from 'react'
import { Menu, Segment, Icon, Header } from 'semantic-ui-react'
import SportsComponent from './sports/sports.component'
import { Route, Link } from 'react-router-dom'
import LeaguesMenuComponent from './leagues/leaguesMenu.component'
import LeaguesComponent from './leagues/leagues.component'
import LeagueDashboardComponent from './leagues/dashboard/leagueDashboard.component'
import LeagueFormComponent from './leagues/leagueForm.component'
import SportFormComponent from './sports/sportForm.component'
import TeamFormComponent from './teams/teamForm.component';
import PlayerFormComponent from './players/playerForm.component';
import SelectLeagueComponent from './selectLeague.component';

export default class SecuredComponent extends Component {
  componentDidMount() {
    document.title = 'Neymar';
  }

  render() {
    return (
      <div>
        <nav>
          <h1 class="brand"><a href="#"><b>NEYMAR | </b>FIFA WORLD CUP 2018</a></h1>
          <ul>
              <li class="category">LEAGUES:</li>
              <SelectLeagueComponent />
              <li><Link to="/">Admin</Link></li>
              <li><a onClick={() => this.props.logout()} href="#">LOG OUT</a></li>
          </ul>
        </nav>
        <div class="box">
          <div class="league-bar">
            <ul>
                <li><a href="#" class="actual-games">ACTUAL GAMES</a></li>
                <li><a href="#" class="my-bets">MY BETS</a></li>
                <li><a href="#" class="table">TABLE</a></li>
                <li><a href="#" class="all-bets">ALL BETS</a></li>
                <li><a href="#" class="rules">RULES</a></li>
                <li><a href="#" class="settings">SETTINGS</a></li>
            </ul>
            <div style={{clear: 'both'}}></div>
          </div>

          <div id="pageBox">
            <Route exact path="/" component={SportsComponent} />
            <Route path="/dashboard/:leagueId" component={LeagueDashboardComponent} />
            <Route path="/leagues/:leagueId/(matches|teams|players)*" component={LeaguesMenuComponent} />
            <Route exact path="/sports/:sportId" component={LeaguesComponent} />
            <Route exact path="/leagues/form/:leagueId" component={LeagueFormComponent} />
            <Route exact path="/sports/form/:sportId" component={SportFormComponent} />
            <Route exact path="/teams/form/:teamId" component={TeamFormComponent} />
            <Route exact path="/players/form/:playerId" component={PlayerFormComponent} />
          </div>
        </div>
      </div>
    )
  }
}
