import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { Card, Header, Button, Divider, Confirm, Modal, Table, Label } from 'semantic-ui-react'
import BetsSerieService from '../../../services/betsSerie.service'
import moment from 'moment'

export default class SpecialBetsSerieComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      bets: []
    }
  }

  async componentDidMount() {
    this.loadBets()
  }

  async loadBets() {
    const bets = await BetsSerieService.getAll(this.props.match.params.leagueId)
    this.setState({ bets, open: false })
  }

  show = () => this.setState({ open: true })
  handleDeleteConfirm = async (betId) => {
    await BetsSerieService.delete(this.props.match.params.leagueId, betId)
    this.loadBets()
  }
  handleDeleteCancel = () => this.setState({ open: false })

  render() {
    return (
      <div>
        <Header as="h1">Série</Header>
        <Link to={`/leagues/${this.props.match.params.leagueId}/bets/serie/form/new`}>
          <Button primary>
            Přidat tip na sérii
          </Button>
        </Link>
        <Divider />
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Typ</Table.HeaderCell>
              <Table.HeaderCell>Datum</Table.HeaderCell>
              <Table.HeaderCell>Domácí</Table.HeaderCell>
              <Table.HeaderCell>Hosté</Table.HeaderCell>
              <Table.HeaderCell>Výsledek</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.bets && this.state.bets.map(bet => (
              <Table.Row>
                <Table.Cell>{bet.specialBetSerie.name}</Table.Cell>
                <Table.Cell>{moment(bet.dateTime).fromNow()}</Table.Cell>
                <Table.Cell>{bet.homeTeam.team.name}</Table.Cell>
                <Table.Cell>{bet.awayTeam.team.name}</Table.Cell>
                <Table.Cell>{bet.homeTeamScore}:{bet.awayTeamScore}</Table.Cell>

                <Table.Cell>
                  <Link to={`/leagues/${this.props.match.params.leagueId}/bets/serie/form/${bet.id}`} style={{marginRight: '5px'}}>Upravit</Link>
                  <a href="#" onClick={this.show}>Smazat</a>
                  <Modal size='small' open={this.state.open} onClose={this.handleDeleteCancel}>
                    <Modal.Header>
                      Smazat {bet.id} ?
                    </Modal.Header>
                    <Modal.Content>
                      <p>Chcete opravdu smazat tip "{bet.id}" ?</p>
                    </Modal.Content>
                    <Modal.Actions>
                      <Button negative onClick={this.handleDeleteCancel}>
                        Ne
                      </Button>
                      <Button positive onClick={() => this.handleDeleteConfirm(bet.id)} icon='checkmark' labelPosition='right' content='Ano'/>
                    </Modal.Actions>
                  </Modal>
                </Table.Cell>
              </Table.Row>
          ))}
          </Table.Body>
        </Table>
      </div>
    )
  }
}
