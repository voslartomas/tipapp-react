import React, { Component } from 'react'
import { Menu, Segment, Breadcrumb } from 'semantic-ui-react'
import SportsComponent from './sports.component'
import { Route, Link } from 'react-router-dom'
import MatchesComponent from './matches.component'
import LeaguesComponent from './leagues/leagues.component'
import LeagueFormComponent from './leagues/leagueForm.component'

export default class SecuredComponent extends Component {
  componentDidMount() {
    document.title = 'Neymar';
  }

  render() {
    return (
      <div>
        <Menu>
          <Menu.Item><h3>NEYMAR</h3></Menu.Item>
          <Menu.Item name="sports" onClick={this.handleItemClick}><Link to="/">Sporty</Link></Menu.Item>
          <Menu.Item position="right" name="logout" onClick={() => this.props.logout()}> Odhlásit <i style={{ marginLeft: '5px' }} className="sign out icon" /></Menu.Item>
        </Menu>

        <Segment>
          <Route exact path="/" component={SportsComponent} />
          <Route exact path="/leagues/:sportId" component={LeaguesComponent} />
          <Route exaxt path="/matches/:leagueId" component={MatchesComponent} />
          <Route exaxt path="/leagues/form/:leagueId" component={LeagueFormComponent} />
        </Segment>
      </div>
    )
  }
}
