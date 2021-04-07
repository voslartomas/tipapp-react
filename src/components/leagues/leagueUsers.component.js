import React, { Component } from 'react';
import { Header, Button, Divider, Modal, Table, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import LeagueUserService from '../../services/leagueUser.service';

export default class LeagueUsersComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      leagueUsers: [],
    };
  }

  async componentDidMount() {
    this.loadLeagueUsers();
  }

  async loadLeagueUsers() {
    const leagueUsers = await LeagueUserService.getUsers(this.props.match.params.leagueId);
    this.setState({ leagueUsers, open: false });
  }

  show = () => this.setState({ open: true });

  handleDeleteConfirm = async (userId) => {
    await LeagueUserService.delete(this.props.match.params.leagueId, userId);
    this.loadLeagueUsers();
  };

  handleDeleteCancel = () => this.setState({ open: false });

  render() {
    return (
      <div>
        <Header as="h1">Ligy</Header>
        <Link to={`/leagues/${this.props.match.params.leagueId}/users/form/new`}>
          <Button primary>Přidat uživatele</Button>
        </Link>
        <Divider />
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Jméno</Table.HeaderCell>
              <Table.HeaderCell>Zaplaceno</Table.HeaderCell>
              <Table.HeaderCell>Aktivní</Table.HeaderCell>
              <Table.HeaderCell>Admin</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.leagueUsers &&
              this.state.leagueUsers.map((leagueUser) => (
                <Table.Row>
                  <Table.Cell>
                    <Label ribbon>
                      {leagueUser.user.firstName} {leagueUser.user.lastName}
                    </Label>
                  </Table.Cell>
                  <Table.Cell>{leagueUser.paid && <span>Ano</span>}</Table.Cell>
                  <Table.Cell>{leagueUser.active && <span>Ano</span>}</Table.Cell>
                  <Table.Cell>{leagueUser.admin && <span>Ano</span>}</Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/leagues/${this.props.match.params.leagueId}/users/form/${leagueUser.id}`}
                      style={{ marginRight: '5px' }}
                    >
                      Upravit
                    </Link>
                    <a href="#" onClick={this.show}>
                      Smazat
                    </a>
                    <Modal size="small" open={this.state.open} onClose={this.handleDeleteCancel}>
                      <Modal.Header>Smazat {leagueUser.name} ?</Modal.Header>
                      <Modal.Content>
                        <p>Chcete opravdu smazat ligu "{leagueUser.name}" ?</p>
                      </Modal.Content>
                      <Modal.Actions>
                        <Button negative onClick={this.handleDeleteCancel}>
                          Ne
                        </Button>
                        <Button
                          positive
                          onClick={() => this.handleDeleteConfirm(leagueUser.id)}
                          icon="checkmark"
                          labelPosition="right"
                          content="Ano"
                        />
                      </Modal.Actions>
                    </Modal>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}
