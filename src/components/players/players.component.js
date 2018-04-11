import React, { Component } from 'react';
import PlayerService from '../../services/player.service'
import LeagueService from '../../services/league.service'
import { Button, Icon, Header, Table, Label, Modal } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class PlayersComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      players: [],
    }
  }

  async componentDidMount() {
    this.loadPlayers()
  }

  async loadPlayers() {
    const players = await PlayerService.getPlayers(this.props.match.params.leagueId)

    this.setState({ players })
  }

  show = () => this.setState({ open: true })
  handleDeleteConfirm = async (playerId) => {
    await LeagueService.deletePlayer(this.props.match.params.leagueId, playerId)
    this.loadPlayers()
    this.setState({'open': false})
  }
  handleDeleteCancel = () => this.setState({ open: false })

  render() {
    return (
      <div>
        <Header as="h1">Hráči</Header>
        <Link to={`/leagues/${this.props.match.params.leagueId}/players/form/new`}>
          <Button primary>
            Přidat hráče
          </Button>
        </Link>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Jméno</Table.HeaderCell>
              <Table.HeaderCell>Tým</Table.HeaderCell>
              <Table.HeaderCell>Zápasy</Table.HeaderCell>
              <Table.HeaderCell>Góly</Table.HeaderCell>
              <Table.HeaderCell>Asistence</Table.HeaderCell>
              <Table.HeaderCell>Body</Table.HeaderCell>
              <Table.HeaderCell>Akce</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.players && this.state.players.map(leaguePlayer => (
              <Table.Row>
                <Table.Cell>
                  <Label ribbon>{leaguePlayer.player.firstName} {leaguePlayer.player.lastName}</Label>
                  <a href="#" onClick={this.show}>Smazat</a>
                  <Modal size='small' open={this.state.open} onClose={this.handleDeleteCancel}>
                    <Modal.Header>
                      Smazat ?
                    </Modal.Header>
                    <Modal.Content>
                      <p>Chcete opravdu smazat tohoto hráče ?</p>
                    </Modal.Content>
                    <Modal.Actions>
                      <Button negative onClick={this.handleDeleteCancel}>
                        Ne
                      </Button>
                      <Button positive onClick={() => this.handleDeleteConfirm(leaguePlayer.id)} icon='checkmark' labelPosition='right' content='Ano'/>
                    </Modal.Actions>
                  </Modal>
                </Table.Cell>
                <Table.Cell>{leaguePlayer.leagueTeam.team.name}</Table.Cell>
                <Table.Cell>{leaguePlayer.seasonGames}</Table.Cell>
                <Table.Cell>{leaguePlayer.seasonGoals}</Table.Cell>
                <Table.Cell>{leaguePlayer.seasonAssists}</Table.Cell>
                <Table.Cell>{leaguePlayer.seasonGoals + leaguePlayer.seasonAssists}</Table.Cell>
              </Table.Row>
          ))}
          </Table.Body>
        </Table>
      </div>
    )
  }
}
