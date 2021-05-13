import React, { useEffect, useContext, useState } from 'react'
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
import CurrentTimestampContext from '../context/CurrentTimestampContext';
import SelectedLeagueContext from '../context/SelectedLeagueContext';
import { getCurrentTimestamp, loadingComponent } from '../helpers/utils';

export default function SecuredComponent(props) {

  const [isLoading, setIsLoading] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const [selectedLeague, setSelectedLeague] = useState(0);

  useEffect(() => {document.title = 'TipApp'}, [document.title])
  useEffect(async () => {
    setIsLoading(true)
    if (!currentTimestamp) { 
      const ts = await getCurrentTimestamp();
      setCurrentTimestamp(ts)
    }
    setIsLoading(false)
  }, [currentTimestamp])

  return (
    <React.Fragment>
      <CurrentTimestampContext.Provider value={currentTimestamp}>
        <SelectedLeagueContext.Provider value={{ selectedLeague, setSelectedLeague }}>
          {loadingComponent(isLoading)}
          <div>
            <nav>
              <h1 className="brand"><a href="#"><SelectLeagueComponent /></a></h1>
              <ul>
                  {/* <li><Link to="/">Admin</Link></li> */}
                  <li><Link to="/profile">Profil</Link></li>
                  <li><a onClick={() => props.logout()} href="#">Odhlášení</a></li>
              </ul>
            </nav>
            <div className="box">
              <div>
                {/* <Route exact path="/" component={LeaguesComponent} /> */}
                <Route exact path="/" render={() => <LeagueDashboardComponent section="matches" />} />
                <Route path="/dashboard/:leagueId/matches" render={() => <LeagueDashboardComponent section="matches" />} />
                <Route path="/dashboard/:leagueId/singles" render={() => <LeagueDashboardComponent section="singles" />} />
                <Route path="/dashboard/:leagueId/series" render={() => <LeagueDashboardComponent section="series" />} />
                <Route path="/dashboard/:leagueId/leaderboard" render={() => <LeagueDashboardComponent section="leaderboard" />} />

                <Route path="/leagues/:leagueId/(matches|teams|players)*" component={LeaguesMenuComponent} />
                <Route exact path="/sports/:sportId" component={LeaguesComponent} />
                <Route exact path="/league/form/:leagueId" component={LeagueFormComponent} />
                <Route exact path="/sports/form/:sportId" component={SportFormComponent} />
                <Route exact path="/teams/form/:teamId" component={TeamFormComponent} />
                <Route exact path="/players/form/:playerId" component={PlayerFormComponent} />
                <Route exact path="/profile/edit/:userId" component={UserFormComponent} />
                <Route exact path="/profile/password" component={PasswordComponent} />
                <Route exact path="/profile" render={routeProps => <ProfileComponent {...routeProps} logout={props.logout} />} />
              </div>
            </div>
          </div>
        </SelectedLeagueContext.Provider>
      </CurrentTimestampContext.Provider>
    </React.Fragment>
  )
}
