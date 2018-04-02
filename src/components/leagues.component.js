import React, { Component } from 'react'
import LeagueService from '../services/league.service'
import { Card } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class LeaguesComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      leagues: [],
    }
  }

  async componentDidMount() {
    const leagues = await LeagueService.getLeagues(this.props.match.params.sportId)

    this.setState({ leagues })
  }

  render() {
    return (
      <Card.Group>
        {this.state.leagues && this.state.leagues.map(league => (
          <Card>
            <Card.Content>
              <Card.Header>
                <Link to={`/matches/${league.id}`}>{league.name}</Link>
              </Card.Header>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    )
  }
}
