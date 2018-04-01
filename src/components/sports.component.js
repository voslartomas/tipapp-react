import React, { Component } from 'react'
import SportService from '../services/sport.service'
import { Card } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class SportsComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sports: [],
    }
  }

  async componentDidMount() {
    const sports = await SportService.getSports()
    console.log(sports)
    this.setState({
      sports,
    })
  }

  render() {
    return (
      <Card.Group>
        {this.state.sports && this.state.sports.map(sport => (
          <Card key={sport.id}>
            <Card.Content>
              <Card.Header>
                <Link to={`/leagues/${sport.id}`}>{sport.czName}</Link>
              </Card.Header>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    )
  }
}
