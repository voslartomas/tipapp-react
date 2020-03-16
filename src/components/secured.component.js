import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import LeaguesMenuComponent from './leagues/leaguesMenu.component'
import LeaguesComponent from './leagues/leagues.component'
import LeagueDashboardComponent from './leagues/dashboard/leagueDashboard.component'
import LeagueFormComponent from './leagues/leagueForm.component'
import SportFormComponent from './sports/sportForm.component'
import TeamFormComponent from './teams/teamForm.component'
import PlayerFormComponent from './players/playerForm.component'
import SelectLeagueComponent from './selectLeague.component'
import ProfileComponent from './profile.component'
import UserFormComponent from './userForm.component'
import PasswordComponent from './password.component'
import { Menu, Image, Container, Dropdown } from 'semantic-ui-react'

export default class SecuredComponent extends Component {
  componentDidMount() {
    document.title = 'Tipovačka';
  }

  render() {
    return (
      <div>
        <Menu fixed="top" inverted>
          <Container>
            <Menu.Item as="a" header>
              <Image
                size="mini"
                src="/logo.png"
                style={{ marginRight: "1.5em" }}
              />
              Project Name
            </Menu.Item>
            <Menu.Item as="a">Home</Menu.Item>

            <Dropdown item simple text="Dropdown">
              <Dropdown.Menu>
                <Dropdown.Item>List Item</Dropdown.Item>
                <Dropdown.Item>List Item</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header>Header Item</Dropdown.Header>
                <Dropdown.Item>
                  <i className="dropdown icon" />
                  <span className="text">Submenu</span>
                  <Dropdown.Menu>
                    <Dropdown.Item>List Item</Dropdown.Item>
                    <Dropdown.Item>List Item</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Item>
                <Dropdown.Item>List Item</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Container>
        </Menu>

        <nav>
          <ul>
            {/* <h1 className="brand"> */}
            <li>
              <Link to="/">Domů</Link>
            </li>
            <li>
              <SelectLeagueComponent />
            </li>
          </ul>
          <ul>
            <li>
              <Link to="/">Admin</Link>
            </li>
            <li>
              <Link to="/profile">Profil</Link>
            </li>
            <li>
              <Link to="/" onClick={() => this.props.logout()}>
                Odhlásit se
              </Link>
            </li>
          </ul>
        </nav>
        <div className="box">
          <div>
            <Route exact path="/" component={LeaguesComponent} />
            <Route
              path="/dashboard/:leagueId/matches"
              render={routeProps => (
                <LeagueDashboardComponent {...routeProps} section="matches" />
              )}
            />
            <Route
              path="/dashboard/:leagueId/singles"
              render={routeProps => (
                <LeagueDashboardComponent {...routeProps} section="singles" />
              )}
            />
            <Route
              path="/dashboard/:leagueId/series"
              render={routeProps => (
                <LeagueDashboardComponent {...routeProps} section="series" />
              )}
            />
            <Route
              path="/dashboard/:leagueId/leaderboard"
              render={routeProps => (
                <LeagueDashboardComponent
                  {...routeProps}
                  section="leaderboard"
                />
              )}
            />

            <Route
              path="/leagues/:leagueId/(matches|teams|players)*"
              component={LeaguesMenuComponent}
            />
            <Route exact path="/sports/:sportId" component={LeaguesComponent} />
            <Route
              exact
              path="/league/form/:leagueId"
              component={LeagueFormComponent}
            />
            <Route
              exact
              path="/sports/form/:sportId"
              component={SportFormComponent}
            />
            <Route
              exact
              path="/teams/form/:teamId"
              component={TeamFormComponent}
            />
            <Route
              exact
              path="/players/form/:playerId"
              component={PlayerFormComponent}
            />
            <Route
              exact
              path="/profile/edit/:userId"
              component={UserFormComponent}
            />
            <Route
              exact
              path="/profile/password"
              component={PasswordComponent}
            />
            <Route
              exact
              path="/profile"
              render={routeProps => (
                <ProfileComponent {...routeProps} logout={this.props.logout} />
              )}
            />
          </div>
        </div>
      </div>
    )
  }
}
