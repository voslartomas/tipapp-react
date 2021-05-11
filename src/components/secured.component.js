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
import ProfileComponent from './profile.component';
import UserFormComponent from './userForm.component';
import PasswordComponent from './password.component';

export default class SecuredComponent extends Component {
  componentDidMount() {
    document.title = 'Neymar';
  }

  render() {
    return (
      <div>
        <nav>
          <h1 className="brand"><a href="#"><SelectLeagueComponent /></a></h1>
          <ul>
              <li><Link to="/">Admin</Link></li>
              <li><Link to="/profile">Profil</Link></li>
              <li><a onClick={() => this.props.logout()} href="#">Odhlášení</a></li>
          </ul>
        </nav>
        <div className="box">
          <div>
            <Route exact path="/" component={LeaguesComponent} />
            <Route path="/dashboard/:leagueId/matches" render={routeProps => <LeagueDashboardComponent {...routeProps} section="matches" />} />
            <Route path="/dashboard/:leagueId/singles" render={routeProps => <LeagueDashboardComponent {...routeProps} section="singles" />} />
            <Route path="/dashboard/:leagueId/series" render={routeProps => <LeagueDashboardComponent {...routeProps} section="series" />} />
            <Route path="/dashboard/:leagueId/leaderboard" render={routeProps => <LeagueDashboardComponent {...routeProps} section="leaderboard" />} />

            <Route path="/leagues/:leagueId/(matches|teams|players)*" component={LeaguesMenuComponent} />
            <Route exact path="/sports/:sportId" component={LeaguesComponent} />
            <Route exact path="/league/form/:leagueId" component={LeagueFormComponent} />
            <Route exact path="/sports/form/:sportId" component={SportFormComponent} />
            <Route exact path="/teams/form/:teamId" component={TeamFormComponent} />
            <Route exact path="/players/form/:playerId" component={PlayerFormComponent} />
            <Route exact path="/profile/edit/:userId" component={UserFormComponent} />
            <Route exact path="/profile/password" component={PasswordComponent} />
            <Route exact path="/profile" render={routeProps => <ProfileComponent {...routeProps} logout={this.props.logout}/>} />
          </div>
        </div>
      </div>
    )
  }
}
