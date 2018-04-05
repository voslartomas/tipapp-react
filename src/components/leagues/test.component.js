import React, { Component } from 'react'
import { Menu, Segment, Sidebar, Icon, Header } from 'semantic-ui-react'
import { Route, Link } from 'react-router-dom'
import MatchesComponent from '../matches.component'
import TeamsComponent from '../teams/teams.component'
import PlayersComponent from '../players/players.component'

export default class TestComponent extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const leagueId = this.props.match.params.leagueId

    return (
      <div>
        <Sidebar.Pushable as={Segment}>
          <Sidebar as={Menu} animation="push" width="thin" visible icon="labeled" vertical>
            <Menu.Item>
              <Link to={`/leagues/matches/${leagueId}`} style={{ marginRight: '5px' }}>Zápasy</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to={`/leagues/teams/${leagueId}`} style={{ marginRight: '5px' }}>Týmy</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to={`/leagues/players/${leagueId}`} style={{ marginRight: '5px' }}>Hráči</Link>
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
              <Route exact path="/leagues/matches/:leagueId" component={MatchesComponent} />
              <Route exact path="/leagues/teams/:leagueId" component={TeamsComponent} />
              <Route exact path="/leagues/players/:leagueId" component={PlayersComponent} />
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  }
}
