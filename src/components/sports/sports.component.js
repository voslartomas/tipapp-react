import React, { Component } from 'react'
import SportService from '../../services/sport.service'
import { Card, Header, Button, Divider, Confirm, Modal, Transition } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import TeamService from '../../services/team.service'
import PlayerService from '../../services/player.service'
import NHLService from '../../services/nhlService.service'

export default class SportsComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sports: [],
      teams: [],
      players: [],
    }
  }

  async componentDidMount() {
    this.loadSports()
    this.loadTeams()
    this.loadPlayers()
  }

  async loadSports() {
    const sports = await SportService.getSports()
    this.setState({
      sports,
    })
  }

  async loadTeams() {
    const teams = await TeamService.getAllTeams()
    this.setState({
      teams,
    })
  }

  async loadPlayers() {
    const players = await PlayerService.getAllPlayers()
    this.setState({
      players,
    })
  }

  async importTeamsFromNHL() {
    NHLService.importTeams()
  }

  async importPlayersFromNHL() {
    NHLService.importPlayers()
  }

  show = () => this.setState({ open: true })
  handleDeleteConfirm = async (sportId) => {
    await SportService.delete(sportId)
    this.loadSports()
    this.setState({ open: false })
  }
  handleDeleteCancel = () => this.setState({ open: false })

  render() {
    return (
      <div>
      <Header as="h1">Sporty</Header>
      <Link to="/sports/form/new">
        <Button primary>
          Přidat sport
        </Button>
      </Link>
      <Link to="/teams/form/new">
        <Button primary>
          Přidat tým
        </Button>
      </Link>
      <Link to="/players/form/new">
        <Button primary>
          Přidat hráče
        </Button>
      </Link>
      <Divider/>
      <Card.Group>
        {this.state.sports && this.state.sports.map(sport => (
          <Card key={sport.id}>
            <Card.Content>
              <Card.Header>
                <Link to={`/sports/${sport.id}`}>{sport.name}</Link>
              </Card.Header>
              <Link to={`/sports/form/${sport.id}`} style={{marginRight: '5px'}}>Upravit</Link>
              <a href="#" onClick={this.show}>Smazat</a>
              {/*<Confirm
                open={this.state.open}
                content='Opravdu smazat?'
                onCancel={this.handleDeleteCancel}
                onConfirm={() => { this.handleDeleteConfirm(sport.id) }}
              />*/}
              <Modal size='small' open={this.state.open} onClose={this.handleDeleteCancel}>
                <Modal.Header>
                  Smazat {sport.czName} ?
                </Modal.Header>
                <Modal.Content>
                  <p>Chcete opravdu smazat sport "{sport.czName}" ?</p>
                </Modal.Content>
                <Modal.Actions>
                  <Button negative onClick={this.handleDeleteCancel}>
                    Ne
                  </Button>
                  <Button positive onClick={() => this.handleDeleteConfirm(sport.id)} icon='checkmark' labelPosition='right' content='Ano'/>
                </Modal.Actions>
              </Modal>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
      <Divider/>
      <Header as="h1">Týmy</Header>
      <Button primary onClick={() => this.importTeamsFromNHL()}>
        Přidat týmy z NHL
      </Button>
      <Card.Group>
        {this.state.teams && this.state.teams.map(team => (
          <Card key={team.id}>
            <Card.Content>
              <Card.Header>
                {team.name}
              </Card.Header>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
      <Divider/>
      <Header as="h1">Hráči</Header>
      <Button primary onClick={() => this.importPlayersFromNHL()}>
        Přidat hráče z NHL
      </Button>
      <Card.Group>
        {this.state.players && this.state.players.map(player => (
          <Card key={player.id}>
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