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
    const matches = await MatchService.getMatches(this.props.match.params.leagueId)
    const sortedMatches = matches.sort((a,b) => a.createdAt - b.createdAt)
    this.setState({ matches: sortedMatches, open: false })
  }

  show = () => this.setState({ open: true })
  handleDeleteConfirm = async (matchId) => {
    await MatchService.delete(matchId)
    this.loadMatches()
  }
  handleDeleteCancel = () => this.setState({ open: false })

  render() {
    return (
      <div>
        <Header as="h1">Zápasy</Header>
        <Link to={`/leagues/${this.props.match.params.leagueId}/matches/form/new`}>
          <Button primary>
            Přidat zápas
          </Button>
        </Link>
        <Divider />
        <Card.Group>
          {this.state.matches && this.state.matches.map(match => (
            <Card key={match.id}>
              <Card.Content>
                <Card.Description>
                  {match.homeTeam && match.homeTeam.team && match.homeTeam.team.name || ''} {match.homeScore || 0}
                  <br />
                  {match.awayTeam && match.awayTeam.team && match.awayTeam.team.name  || ''} {match.awayScore || 0}
                </Card.Description>
                <Link to={`/leagues/${this.props.match.params.leagueId}/matches/form/${match.id}`} style={{marginRight: '5px'}}>Upravit</Link>
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
      </div>
    )
  }
}
