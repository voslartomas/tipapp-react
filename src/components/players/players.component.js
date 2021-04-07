import React, { Component } from 'react';
import { Button, Header, Table, Label, Modal, Form, Input } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PlayerService from '../../services/player.service';
import LeagueService from '../../services/league.service';

export default class PlayersComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      players: [],
      search: '',
    };
  }

  async componentDidMount() {
    this.loadPlayers();
  }

  async loadPlayers() {
    const players = await PlayerService.getPlayers(this.props.match.params.leagueId);

    this.setState({ players });
  }

  filter(players) {
    const search = this.normalize(this.state.search);

    const p = players
      .filter(
        (player) =>
          this.normalize(player.player.firstName).indexOf(search) !== -1 ||
          this.normalize(player.player.lastName).indexOf(search) !== -1 ||
          this.normalize(player.leagueTeam.team.name).indexOf(search) !== -1,
      )
      .slice(0, 50);

    return p;
  }

  normalize(string) {
    return string.replace(/^\s+|\s+$/g, '').toLowerCase();
  }

  show = () => this.setState({ open: true });

  handleDeleteConfirm = async (playerId) => {
    await LeagueService.deletePlayer(this.props.match.params.leagueId, playerId);
    this.loadPlayers();
    this.setState({ open: false });
  };

  handleDeleteCancel = () => this.setState({ open: false });

  render() {
    return (
      <div>
        <Header as="h1">Hráči</Header>
        <Link to={`/leagues/${this.props.match.params.leagueId}/players/form/new`}>
          <Button primary>Přidat hráče</Button>
        </Link>

        <Form.Field>
          <label>Vyhledávání</label>
          <Input
            placeholder="Jméno hráče"
            value={this.state.search}
            onChange={(event) => this.setState({ search: event.target.value })}
          />
        </Form.Field>

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
            {this.state.players &&
              this.filter(this.state.players).map((leaguePlayer) => (
                <Table.Row>
                  <Table.Cell>
                    <Label ribbon>
                      {leaguePlayer.player.firstName} {leaguePlayer.player.lastName}
                    </Label>
                    <a href="#" onClick={this.show}>
                      Smazat
                    </a>
                    <Link to={`/leagues/${this.props.match.params.leagueId}/players/form/${leaguePlayer.id}`}>
                      Upravit
                    </Link>
                    <Modal size="small" open={this.state.open} onClose={this.handleDeleteCancel}>
                      <Modal.Header>Smazat ?</Modal.Header>
                      <Modal.Content>
                        <p>Chcete opravdu smazat tohoto hráče ?</p>
                      </Modal.Content>
                      <Modal.Actions>
                        <Button negative onClick={this.handleDeleteCancel}>
                          Ne
                        </Button>
                        <Button
                          positive
                          onClick={() => this.handleDeleteConfirm(leaguePlayer.id)}
                          icon="checkmark"
                          labelPosition="right"
                          content="Ano"
                        />
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
    );
  }
}
