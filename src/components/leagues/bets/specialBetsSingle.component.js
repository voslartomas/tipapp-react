import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Header, Button, Divider, Modal, Table } from 'semantic-ui-react'
import BetsSingleService from '../../../services/betsSingle.service'
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
    const bets = await BetsSingleService.getAll(this.props.match.params.leagueId)
    this.setState({ bets, open: false })
  }

  show = () => this.setState({ open: true })

  handleDeleteConfirm = async (betId) => {
    await BetsSingleService.delete(this.props.match.params.leagueId, betId);
    this.loadBets();
  }
  handleDeleteCancel = () => this.setState({ open: false })

  render() {
    return (
      <div>
        <Header as="h1">Single</Header>
        <Link to={`/leagues/${this.props.match.params.leagueId}/bets/single/form/new`}>
          <Button primary>
            Přidat sázku na sérii
          </Button>
        </Link>
        <Divider />
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Typ</Table.HeaderCell>
              <Table.HeaderCell>Datum</Table.HeaderCell>
              <Table.HeaderCell>Výsledek</Table.HeaderCell>
              <Table.HeaderCell>Body</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.bets && this.state.bets.map(bet => (
              <Table.Row>
                <Table.Cell>{bet.specialBetSingle.name}</Table.Cell>
                <Table.Cell>{moment(bet.dateTime).fromNow()}</Table.Cell>
                <Table.Cell>
                  {bet.specialBetTeamResult && bet.specialBetTeamResult.team.name}
                  {bet.specialBetPlayerResult && `${bet.specialBetPlayerResult.player.firstName} ${bet.specialBetPlayerResult.player.lastName}`}
                  {bet.specialBetValue && bet.specialBetValue}
                </Table.Cell>
                <Table.Cell>{bet.points}</Table.Cell>
                <Table.Cell>
                  <Link to={`/leagues/${this.props.match.params.leagueId}/bets/single/form/${bet.id}`} style={{marginRight: '5px'}}>Upravit</Link>
                  <button onClick={this.show}>Smazat</button>
                  <Modal size='small' open={this.state.open} onClose={this.handleDeleteCancel}>
                    <Modal.Header>
                      Smazat {bet.id} ?
                    </Modal.Header>
                    <Modal.Content>
                      <p>Chcete opravdu smazat sázku "{bet.id}" ?</p>
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
