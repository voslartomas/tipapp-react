import React, { Component } from 'react';
import { Button, Form } from 'semantic-ui-react';
import moment from 'moment';
import UserBetsSingleService from '../../../services/userBetsSingle.service';
import PlayerService from '../../../services/player.service';
import LeagueService from '../../../services/league.service';

export default class SingleBetsComponent extends Component {
  constructor(props) {
    super(props);

    this.userBets = {};
    this.state = {
      singleBets: [],
      playersOptions: [],
      teamsOptions: [],
      leagueId: undefined,
    };
  }

  async componentDidMount() {
    const players = await PlayerService.getPlayers(this.props.match.params.leagueId, []);
    const teams = await LeagueService.getTeams(this.props.match.params.leagueId);

    const playersOptions = players.map((player) => ({
      key: player.id,
      text: `${player.player.firstName} ${player.player.lastName}`,
      value: player.id,
    }));

    const teamsOptions = teams.map((team) => ({
      key: team.id,
      text: team.team.name,
      value: team.id,
    }));

    this.setState({
      playersOptions,
      teamsOptions,
      leagueId: this.props.id,
    });
    this.loadBets();
  }

  async loadBets() {
    const bets = await UserBetsSingleService.getAll(this.props.match.params.leagueId);

    this.setState({ singleBets: bets });
  }

  getResult(bet) {
    if (bet.valueBet) {
      return bet.valueBet;
    }
    if (bet.playerBet) {
      return `${bet.playerBet}`;
    }
    if (bet.teamBet) {
      return bet.teamBet;
    }
    return '';
  }

  betPlaced(bet) {
    return bet.id;
  }

  async submitBet(bet) {
    const value = this.userBets[bet.singleId];

    if (value) {
      const data = {
        leagueSpecialBetSingleId: bet.singleId,
      };

      if (bet.type === 1) {
        data.playerResultId = value;
      } else if (bet.type === 2) {
        data.teamResultId = value;
      } else if (bet.type === 3) {
        data.value = value;
      }

      await UserBetsSingleService.put(this.props.match.params.leagueId, data, bet.id || 0);
      this.loadBets();
    }
  }

  canBet(bet) {
    return new Date(bet.endDate).getTime() > new Date().getTime();
  }

  handleChange(bet, value) {
    this.userBets[bet.singleId] = value;
  }

  render() {
    if (this.props.id !== this.state.leagueId) {
      this.componentDidMount();
    }

    return (
      <div className="page">
        <div className="box-header">Speciální</div>
        <table>
          <tr>
            <th width="40%" align="left">
              Název
            </th>
            <th width="10%">Výsledek</th>
            <th width="10%">Datum</th>
            <th width="10%">Tip</th>
            <th width="10%">Body</th>
          </tr>
          {this.state.singleBets.map((bet) => (
            <tr>
              <td align="left">{bet.name}</td>
              <td>
                {bet.team && bet.team}
                {bet.player && bet.player}
                {bet.value && bet.value}
              </td>
              <td>{this.canBet(bet) && <span>Konec {moment(bet.endDate).fromNow()}</span>}</td>
              <td>
                {this.getResult(bet)}
                {this.canBet(bet) && (
                  <div>
                    {bet.type === 1 && (
                      <Form.Field>
                        <Form.Select
                          fluid
                          required
                          onChange={(e, { value }) => this.handleChange(bet, value)}
                          label="Hráč"
                          search
                          options={this.state.playersOptions}
                          placeholder="Vyberte hráče"
                        />
                      </Form.Field>
                    )}
                    {bet.type === 2 && (
                      <Form.Field>
                        <Form.Select
                          fluid
                          required
                          label="Tým"
                          onChange={(e, { value }) => this.handleChange(bet, value)}
                          search
                          options={this.state.teamsOptions}
                          placeholder="Vyberte tým"
                        />
                      </Form.Field>
                    )}
                    {bet.type === 3 && (
                      <span>
                        <input onChange={(e) => this.handleChange(bet, e.target.value)} type="text" />
                      </span>
                    )}
                    <Button onClick={() => this.submitBet(bet)}>Uložit sázku</Button>
                  </div>
                )}
              </td>
              <td>
                <b>{this.betPlaced(bet) && bet.totalPoints}</b>
              </td>
            </tr>
          ))}
        </table>
      </div>
    );
  }
}
