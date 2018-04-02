import React, { Component } from 'react';
import MatchService from '../services/match.service'
import PlayerService from '../services/player.service'
import TeamService from '../services/team.service'
import { Card, Header } from 'semantic-ui-react'

export default class MatchesComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      matches: [],
      players: [],
      teams: [],
      team: undefined
    }
  }

  async componentDidMount() {
    const matches = await MatchService.getMatches(this.props.match.params.leagueId)
    const players = await PlayerService.getPlayers(this.props.match.params.leagueId)
    const teams = await TeamService.getTeams(this.props.match.params.leagueId)

    this.setState({ matches: matches })
    this.setState({ players: players })
    this.setState({ teams: teams })
  }

  render() {
    return (
      <div>
      <Header as="h1">Zápasy</Header>
      <Card.Group>
        {this.state.matches && this.state.matches.map(match => (
          <Card>
            <Card.Content>
              <Card.Header>
                {match.title} {match.homeScore || 0}:{match.awayScore || 0}
              </Card.Header>
              <Card.Description>
                {await TeamService.getTeamById(1).czName} vs {await TeamService.getTeamById(2).czName}
              </Card.Description>
            </Card.Content>
          </Card>
                ))}
      </Card.Group>
      <Header as="h1">Týmy</Header>
      <Card.Group>
        {this.state.teams && this.state.teams.map(team => (
          <Card>
            <Card.Content>
              <Card.Header>
                {team.czName} ({team.shortcut})
              </Card.Header>
            </Card.Content>
          </Card>
                ))}
      </Card.Group>
      <Header as="h1">Hráči</Header>
      <Card.Group>
        {this.state.players && this.state.players.map(player => (
          <Card>
            <Card.Content>
              <Card.Header>
                {player.firstName} {player.lastName}
              </Card.Header>
            </Card.Content>
          </Card>
                ))}
      </Card.Group>
      </div>
    )
  }
}
