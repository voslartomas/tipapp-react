import React, { Component } from 'react'
import { Menu, Segment, Sidebar, Icon, Header } from 'semantic-ui-react'
import { Route, Link } from 'react-router-dom'
import MatchesComponent from '../matches/matches.component'
import TeamsComponent from '../teams/teams.component'
import PlayersComponent from '../players/players.component'
import MatchFormComponent from '../matches/matchForm.component'

export default class LeaguesMenuComponent extends Component {
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
              <Link to={`/leagues/${leagueId}/matches`} style={{ marginRight: '5px' }}>Zápasy</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to={`/leagues/${leagueId}/teams`} style={{ marginRight: '5px' }}>Týmy</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to={`/leagues/${leagueId}/players`} style={{ marginRight: '5px' }}>Hráči</Link>
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
              <Route exact path="/leagues/:leagueId/matches" component={MatchesComponent} />
              <Route exact path="/leagues/:leagueId/teams" component={TeamsComponent} />
              <Route exact path="/leagues/:leagueId/players" component={PlayersComponent} />

              <Route exact path="/leagues/:leagueId/matches/form/:matchId" component={MatchFormComponent} />
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  }
}
