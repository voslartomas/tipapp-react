import React, { Component } from 'react'
import { Menu, Segment } from 'semantic-ui-react'
import SportsComponent from './sports.component'
import LeaguesComponent from './leagues.component'
import { Route, Link } from 'react-router-dom'
import MatchesComponent from './matches.component'

export default class SecuredComponent extends Component {
  render() {
    return (
      <div>
        <Menu pointing secondary>
          <Menu.Item name="home" onClick={this.handleItemClick}>
            <Link to="/">Sporty</Link>
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item name="Odhlásit" onClick={() => this.props.logout()} />
          </Menu.Menu>
        </Menu>

        <Segment>
          <Route exact path="/" component={SportsComponent} />
          <Route exact path="/leagues/:sportId" component={LeaguesComponent} />
          <Route exaxt path="/matches/:leagueId" component={MatchesComponent} />
        </Segment>
      </div>
    )
  }
}
