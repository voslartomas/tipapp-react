import React, { Component } from 'react';
import MatchService from '../../services/match.service'
import PlayerService from '../../services/player.service'
import TeamService from '../../services/team.service'
import { Card, Header, Button, Divider, Modal } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class MatchesComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      matches: [],
      players: [],
      teams: [],
      team: undefined,
    }
  }

  async componentDidMount() {
    this.loadMatches()
  }

  async loadMatches() {
    const matches = await MatchService.getMatches(this.props.match.params.sportId)
    this.setState({ matches })
  }

  show = () => this.setState({ open: true })
  handleDeleteConfirm = async (matchId) => {
    await MatchService.delete(matchId)
    this.loadMatches()
    this.setState({ open: false })
  }
  handleDeleteCancel = () => this.setState({ open: false })

  async componentDidMount() {
    const matches = await MatchService.getMatches(this.props.match.params.leagueId)
    const players = await PlayerService.getPlayers(this.props.match.params.leagueId)
    const teams = await TeamService.getTeams(this.props.match.params.leagueId)

    this.setState({ matches, players, teams })
  }

  render() {
    return (
      <div>
        <Header as="h1">Zápasy</Header>
        <Link to="/matches/form/new">
          <Button primary>
            Přidat zápas
          </Button>
        </Link>
        <Divider />
        <Card.Group>
          {this.state.matches && this.state.matches.map(match => (
            <Card>
              <Card.Content>
                <Card.Header>
                  {match.homeScore || 0}:{match.awayScore || 0}
                </Card.Header>
                <Card.Description>
                  {match.homeTeam.czName} <b>X</b> {match.awayTeam.czName}
                </Card.Description>
                <Link to={`/matches/form/${match.id}`} style={{marginRight: '5px'}}>Upravit</Link>
                <a href="#" onClick={this.show}>Smazat</a>
                <Modal size='small' open={this.state.open} onClose={this.handleDeleteCancel}>
                  <Modal.Header>
                    Smazat ?
                  </Modal.Header>
                  <Modal.Content>
                    <p>Chcete opravdu smazat tento zápas ?</p>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button negative onClick={this.handleDeleteCancel}>
                      Ne
                    </Button>
                    <Button positive onClick={() => this.handleDeleteConfirm(match.id)} icon='checkmark' labelPosition='right' content='Ano'/>
                  </Modal.Actions>
                </Modal>
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
                  {player.firstName} {player.lastName} ({player.team.shortcut})
                </Card.Header>
              </Card.Content>
            </Card>
                ))}
        </Card.Group>
      </div>
    )
  }
}
