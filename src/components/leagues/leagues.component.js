import React, { Component } from 'react'
import LeagueService from '../../services/league.service'
import { Card, Header, Button, Divider, Confirm, Modal } from 'semantic-ui-react'
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
    const leagues = await LeagueService.getUserLeagues()
    this.setState({ leagues })
  }

  handleDelete = async (leagueId) => {
    if (window.confirm('Opravdu smazat?')) {
      await LeagueService.delete(leagueId)
      this.loadLeagues()
    }
  }

  render() {
    return (
      <div style={{backgroundColor: 'white'}}>
        <Header as="h1">Ligy</Header>
        <Link to="/league/form/new">
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
                <Link to={`/league/form/${league.id}`} style={{marginRight: '5px'}}>Upravit</Link>
                <a href="#" onClick={() => this.handleDelete(league.id)} style={{marginRight: '5px'}}>Smazat</a>
              </Card.Content>
            </Card>
        ))}
        </Card.Group>
      </div>
    )
  }
}
