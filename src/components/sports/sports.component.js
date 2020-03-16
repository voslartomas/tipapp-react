import React, { Component } from 'react'
import SportService from '../../services/sport.service'
import { Card, Header, Button, Divider, Modal } from 'semantic-ui-react'
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
      </div>
    )
  }
}