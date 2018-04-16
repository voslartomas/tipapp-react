import React, { Component } from 'react';
import LeagueService from '../../services/league.service'
import { Button, Image, Icon, Header, Table, Label, Modal } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import NHLService from '../../services/nhl.service'

export default class TeamsComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      teams: [],
    }
  }

  async componentDidMount() {
    this.loadTeams()

    console.log(await NHLService.getAllTeams());
  }

  async loadTeams() {
    const teams = await LeagueService.getTeams(this.props.match.params.leagueId)

    this.setState({ teams, open: false })
  }

  show = () => this.setState({ open: true })
  handleDeleteConfirm = async (teamId) => {
    await LeagueService.deleteTeam(this.props.match.params.leagueId, teamId)
    this.loadTeams()
  }
  handleDeleteCancel = () => this.setState({ open: false })

  render() {
    return (
      <div>
        <Header as="h1">Týmy</Header>
        <Link to={`/leagues/${this.props.match.params.leagueId}/teams/form/new`}>
          <Button primary>
            Přidat tým
          </Button>
        </Link>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Jméno</Table.HeaderCell>
              <Table.HeaderCell>Liga</Table.HeaderCell>
              <Table.HeaderCell>Sport</Table.HeaderCell>
              <Table.HeaderCell>Akce</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.teams && this.state.teams.map(team => (
              <Table.Row>
                <Table.Cell>
                  <Label ribbon>{team.team.name} {team.team.shortcut}</Label>
                  <a href="#" onClick={this.show}>Smazat</a>
                  <Modal size='small' open={this.state.open} onClose={this.handleDeleteCancel}>
                    <Modal.Header>
                      Smazat ?
                    </Modal.Header>
                    <Modal.Content>
                      <p>Chcete opravdu smazat tento tým ?</p>
                    </Modal.Content>
                    <Modal.Actions>
                      <Button negative onClick={this.handleDeleteCancel}>
                        Ne
                      </Button>
                      <Button positive onClick={() => this.handleDeleteConfirm(team.id)} icon='checkmark' labelPosition='right' content='Ano'/>
                    </Modal.Actions>
                  </Modal>
                </Table.Cell>
                <Table.Cell>{team.league.name}</Table.Cell>
                <Table.Cell>{team.league.sport.name}</Table.Cell>
                <Table.Cell />
              </Table.Row>
          ))}
          </Table.Body>
        </Table>
      </div>
    )
  }
}
