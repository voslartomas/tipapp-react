import React, { Component } from 'react'
import LeagueService from '../../services/league.service'
import { Card, Header, Button, Divider, Confirm, Modal } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import NHLService from '../../services/nhlService.service'
import TeamService from '../../services/team.service'

export default class LeaguesComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      leagues: [],
    }
  }

  async componentDidMount() {
    this.loadLeagues()
    this.loadTeams()
  }

  async loadLeagues() {
    const leagues = await LeagueService.getLeagues(this.props.match.params.sportId)
    this.setState({ leagues, open: false })
  }

  async importTeamsFromNHL(leagueId) {
    NHLService.importTeams(leagueId)
  }

  async loadTeams() {
    const teams = await TeamService.getAllTeams()
    this.setState({
      teams,
    })
  }

  show = () => this.setState({ open: true })
  handleDeleteConfirm = async (leagueId) => {
    await LeagueService.delete(leagueId)
    this.loadLeagues()
  }
  handleDeleteCancel = () => this.setState({ open: false })

  render() {
    return (
      <div>
        <Header as="h1">Ligy</Header>
        <Link to="/leagues/form/new">
          <Button primary>
            Přidat ligu
          </Button>
        </Link>
        <Divider />
        <Card.Group>
          {this.state.leagues && this.state.leagues.map(league => (
            <Card>
              <Card.Content>
                <Card.Header>
                  <Link to={`/leagues/${league.id}/matches`}>{league.name}</Link>
                </Card.Header>
                <Link to={`/dashboard/${league.id}`} style={{marginRight: '5px'}}>Sázky</Link>
                <Link to={`/leagues/form/${league.id}`} style={{marginRight: '5px'}}>Upravit</Link>
                <a href="#" onClick={this.show} style={{marginRight: '5px'}}>Smazat</a>
                <a href="#" onClick={() => this.importTeamsFromNHL(league.id)}>Přidat týmy z NHL</a>
                {/*<Confirm
                  open={this.state.open}
                  content='Opravdu smazat?'
                  onCancel={this.handleDeleteCancel}
                  onConfirm={() => { this.handleDeleteConfirm(league.id) }}
                />*/}
                <Modal size='small' open={this.state.open} onClose={this.handleDeleteCancel}>
                  <Modal.Header>
                    Smazat {league.name} ?
                  </Modal.Header>
                  <Modal.Content>
                    <p>Chcete opravdu smazat ligu "{league.name}" ?</p>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button negative onClick={this.handleDeleteCancel}>
                      Ne
                    </Button>
                    <Button positive onClick={() => this.handleDeleteConfirm(league.id)} icon='checkmark' labelPosition='right' content='Ano'/>
                  </Modal.Actions>
                </Modal>
              </Card.Content>
            </Card>
        ))}
        </Card.Group>
        <Divider/>
        <Header as="h1">Týmy</Header>
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
      </div>
    )
  }
}
