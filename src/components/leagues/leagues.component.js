import React, { Component } from 'react'
import LeagueService from '../../services/league.service'
import { Card, Header, Button, Divider, Confirm } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class LeaguesComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      leagues: [],
    }
  }

  async componentDidMount() {
    this.loadLeagues()
  }

  async loadLeagues() {
    const leagues = await LeagueService.getLeagues(this.props.match.params.sportId)
    this.setState({ leagues })
  }

  show = () => this.setState({ open: true })
  handleDeleteConfirm = async (leagueId) => {
    await LeagueService.delete(leagueId)
    this.loadLeagues()
    this.setState({ open: false })
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
                  <Link to={`/matches/${league.id}`}>{league.name}</Link>
                </Card.Header>
                <Link to={`/leagues/form/${league.id}`} style={{marginRight: '5px'}}>Upravit</Link>
                <a href="#" onClick={this.show}>Smazat</a>
                <Confirm
                  open={this.state.open}
                  content='Opravdu smazat?'
                  onCancel={this.handleDeleteCancel}
                  onConfirm={() => { this.handleDeleteConfirm(league.id) }}
                />
              </Card.Content>
            </Card>
        ))}
        </Card.Group>
      </div>
    )
  }
}
