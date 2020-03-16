import React, { Component } from 'react'
import { Menu, Segment, Sidebar } from 'semantic-ui-react'
import { Route, Link } from 'react-router-dom'
import MatchesComponent from '../matches/matches.component'
import TeamsComponent from '../teams/teams.component'
import PlayersComponent from '../players/players.component'
import MatchFormComponent from '../matches/matchForm.component'
import LeagueUsersComponent from './leagueUsers.component'
import LeagueBetsComponent from './bets/leagueBets.component'
import LeagueUserFormComponent from './leagueUserForm.component'
import SerieFormComponent from './bets/serieForm.component'
import SingleFormComponent from './bets/singleForm.component'
import LeagueTeamFormComponent from './leagueTeamForm.component'
import LeaguePlayerFormComponent from './leaguePlayerForm.component'
import EvaluatorsComponent from './evaluators.component'
import EvaluatorFormComponent from './evaluatorForm.component'
import SettingsComponent from './settings.component'

export default class LeaguesMenuComponent extends Component {

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
            <Menu.Item>
              <Link to={`/leagues/${leagueId}/users`} style={{ marginRight: '5px' }}>Soutěžící</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to={`/leagues/${leagueId}/bets/serie`} style={{ marginRight: '5px' }}>Sázky</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to={`/leagues/${leagueId}/evaluators`} style={{ marginRight: '5px' }}>Bodování</Link>
            </Menu.Item>
            <Menu.Item>
              <Link to={`/leagues/${leagueId}/settings`} style={{ marginRight: '5px' }}>Nastavení</Link>
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
              <Route exact path="/leagues/:leagueId/matches" component={MatchesComponent} />
              <Route exact path="/leagues/:leagueId/teams" component={TeamsComponent} />
              <Route exact path="/leagues/:leagueId/players" component={PlayersComponent} />
              <Route exact path="/leagues/:leagueId/users" component={LeagueUsersComponent} />
              <Route exact path="/leagues/:leagueId/bets/:type" component={LeagueBetsComponent} />
              <Route exact path="/leagues/:leagueId/settings" component={SettingsComponent} />
              <Route exact path="/leagues/:leagueId/evaluators" component={EvaluatorsComponent} />

              <Route exact path="/leagues/:leagueId/matches/form/:matchId" component={MatchFormComponent} />
              <Route exact path="/leagues/:leagueId/teams/form/:teamId" component={LeagueTeamFormComponent} />
              <Route exact path="/leagues/:leagueId/players/form/:playerId" component={LeaguePlayerFormComponent} />
              <Route exact path="/leagues/:leagueId/users/form/:userId" component={LeagueUserFormComponent} />
              <Route exact path="/leagues/:leagueId/bets/serie/form/:serieId" component={SerieFormComponent} />
              <Route exact path="/leagues/:leagueId/bets/single/form/:singleId" component={SingleFormComponent} />
              <Route exact path="/leagues/:leagueId/evaluators/form/:evaluatorId" component={EvaluatorFormComponent} />
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  }
}
