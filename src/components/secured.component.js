import React, { Component } from 'react'
import { Menu, Segment, Icon, Header } from 'semantic-ui-react'
import SportsComponent from './sports/sports.component'
import { Route, Link } from 'react-router-dom'
import LeaguesMenuComponent from './leagues/leaguesMenu.component'
import LeaguesComponent from './leagues/leagues.component'
import LeagueFormComponent from './leagues/leagueForm.component'
import SportFormComponent from './sports/sportForm.component'
import TeamFormComponent from './teams/teamForm.component';
import PlayerFormComponent from './players/playerForm.component';

export default class SecuredComponent extends Component {
  componentDidMount() {
    document.title = 'Neymar';
  }

  render() {
    return (
      <div>
        <Menu>
          <Menu.Item><h3>NEYMAR</h3></Menu.Item>
          <Menu.Item name="sports"><Link to="/">Sporty</Link></Menu.Item>
          <Menu.Item position="right" name="logout" onClick={() => this.props.logout()}> Odhlásit <i style={{ marginLeft: '5px' }} className="sign out icon" /></Menu.Item>
        </Menu>

        <Segment>
          <Route exact path="/" component={SportsComponent} />
          <Route path="/leagues/:leagueId/(matches|teams|players)*" component={LeaguesMenuComponent} />
          <Route exact path="/sports/:sportId" component={LeaguesComponent} />
          <Route exact path="/leagues/form/:leagueId" component={LeagueFormComponent} />
          <Route exact path="/sports/form/:sportId" component={SportFormComponent} />
          <Route exact path="/teams/form/:teamId" component={TeamFormComponent} />
          <Route exact path="/players/form/:playerId" component={PlayerFormComponent} />
        </Segment>
      </div>
    )
  }
}
