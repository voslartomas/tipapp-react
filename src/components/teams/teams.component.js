import React, { Component } from 'react';
import TeamService from '../../services/team.service'
import { Button, Image, Icon, Header, Table, Label, Modal } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default class TeamsComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      teams: [],
    }
  }

  async componentDidMount() {
    this.loadTeams()
  }

  async loadTeams() {
    const teams = await TeamService.getTeams(this.props.match.params.leagueId)

    this.setState({ teams })
  }

  show = () => this.setState({ open: true })
  handleDeleteConfirm = async (teamId) => {
    await TeamService.delete(teamId)
    this.loadMatches()
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
                  <Label ribbon>{team.czName} {team.shortcut}</Label>
                  <Link to={`/leagues/${this.props.match.params.leagueId}/teams/form/${team.id}`} style={{marginRight: '5px'}}>Upravit</Link>
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
                <Table.Cell>{team.sport.czName}</Table.Cell>
                <Table.Cell />
              </Table.Row>
          ))}
          </Table.Body>
        </Table>
      </div>
    )
  }
}
