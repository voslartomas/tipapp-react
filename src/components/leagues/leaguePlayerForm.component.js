import React, { Component } from 'react';
import { Header, Form, Input, Button, Radio } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import PlayerService from '../../services/player.service';
import LeagueService from '../../services/league.service';
import TeamService from '../../services/team.service';

export default class LeaguePlayerFormComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      player: {},
      playersOptions: [],
      leagueTeamsOptions: [],
      redirect: undefined,
    };
  }

  async componentDidMount() {
    const { playerId, leagueId } = this.props.match.params;
    let player = {
      leagueId,
    };
    if (playerId !== 'new') {
      try {
        player = await LeagueService.getPlayerById(leagueId, playerId);
      } catch (e) {
        console.error(e);
      }
    }

    const teams = await TeamService.getTeams(leagueId);
    const leagueTeamsOptions = teams.map((leagueTeam) => ({
      key: leagueTeam.id,
      text: leagueTeam.team.name,
      value: leagueTeam.id,
    }));

    const players = await PlayerService.getAllPlayers();
    const playersOptions = players.map((_player) => ({
      key: _player.id,
      text: `${_player.firstName} ${_player.lastName}`,
      value: _player.id,
    }));

    this.setState({
      player,
      leagueTeamsOptions,
      playersOptions,
    });
  }

  handleBestScorerChange = (e, { value }) => {
    const val = parseInt(value);
    this.setState({
      player: {
        ...this.state.player,
        bestScorer: val === 1,
        secondBestScorer: val === 2,
        thirdBestScorer: val === 3,
        fourthBestScorer: val === 4,
      },
    });
  };

  async saveForm() {
    if (this.state.player.id) {
      await LeagueService.updatePlayer(this.props.match.params.leagueId, this.state.player, this.state.player.id);
    } else {
      await LeagueService.createPlayer(this.props.match.params.leagueId, this.state.player);
    }

    this.setState({
      redirect: `/leagues/${this.props.match.params.leagueId}/players`,
    });
  }

  render() {
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    return (
      <div>
        <Header as="h1">Přidat hráče</Header>
        <Form onSubmit={() => this.saveForm()}>
          <Form.Field>
            <Form.Select
              fluid
              required
              label="Tým"
              options={this.state.leagueTeamsOptions}
              value={this.state.player.leagueTeamId}
              placeholder="Vyberte tým"
              onChange={(event, { value }) => {
                this.setState({
                  player: { ...this.state.player, leagueTeamId: value },
                });
              }}
            />
          </Form.Field>
          <Form.Field>
            <Form.Select
              fluid
              required
              label="Hráč"
              options={this.state.playersOptions}
              value={this.state.player.playerId}
              placeholder="Vyberte hráče"
              onChange={(event, { value }) => {
                this.setState({
                  player: { ...this.state.player, playerId: value },
                });
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>Hry za sezónu</label>
            <Input
              placeholder="Zápasy za sezónu"
              value={this.state.player.seasonGames}
              onChange={(event) =>
                this.setState({
                  player: {
                    ...this.state.player,
                    seasonGames: event.target.value,
                  },
                })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Góly za sezónu</label>
            <Input
              placeholder="Góly za sezónu"
              value={this.state.player.seasonGoals}
              onChange={(event) =>
                this.setState({
                  player: {
                    ...this.state.player,
                    seasonGoals: event.target.value,
                  },
                })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Asistence za sezónu</label>
            <Input
              placeholder="Asistence za sezónu"
              value={this.state.player.seasonAssists}
              onChange={(event) =>
                this.setState({
                  player: {
                    ...this.state.player,
                    seasonAssists: event.target.value,
                  },
                })
              }
            />
          </Form.Field>
          <Form.Field>
            <Form.Field>
              <label>Nejlepší střelec</label>
            </Form.Field>
            <Form.Field>
              <Radio
                label="Nejlepší střelec"
                name="radioGroup"
                value="1"
                checked={this.state.player.bestScorer}
                onChange={this.handleBestScorerChange}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label="2. nejlepší střelec"
                name="radioGroup"
                value="2"
                checked={this.state.player.secondBestScorer}
                onChange={this.handleBestScorerChange}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label="3. nejlepší střelec"
                name="radioGroup"
                value="3"
                checked={this.state.player.thirdBestScorer}
                onChange={this.handleBestScorerChange}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label="4. nejlepší střelec"
                name="radioGroup"
                value="4"
                checked={this.state.player.fourthBestScorer}
                onChange={this.handleBestScorerChange}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label="Nepatří mezi nejlepší střelce"
                name="radioGroup"
                value="0"
                checked={
                  !this.state.player.bestScorer &&
                  !this.state.player.secondBestScorer &&
                  !this.state.player.thirdBestScorer &&
                  !this.state.player.fourthBestScorer
                }
                onChange={this.handleBestScorerChange}
              />
            </Form.Field>
          </Form.Field>
          <Button type="submit">Potvrdit změny</Button>
        </Form>
      </div>
    );
  }
}
