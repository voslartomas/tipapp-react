import React, { Component } from 'react'
import SportService from '../../services/sport.service'
import { Card, Header, Button, Divider, Confirm } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class SportsComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sports: [],
    }
  }

  async componentDidMount() {
    this.loadSports()
  }

  async loadSports() {
    const sports = await SportService.getSports()
    console.log(sports)
    this.setState({
      sports,
    })
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
      <Divider/>
      <Card.Group>
        {this.state.sports && this.state.sports.map(sport => (
          <Card key={sport.id}>
            <Card.Content>
              <Card.Header>
                <Link to={`/leagues/${sport.id}`}>{sport.czName}</Link>
              </Card.Header>
              <Link to={`/sports/form/${sport.id}`} style={{marginRight: '5px'}}>Upravit</Link>
              <a href="#" onClick={this.show}>Smazat</a>
              <Confirm
                open={this.state.open}
                content='Opravdu smazat?'
                onCancel={this.handleDeleteCancel}
                onConfirm={() => { this.handleDeleteConfirm(sport.id) }}
              />
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
      </div>
    )
  }
}
