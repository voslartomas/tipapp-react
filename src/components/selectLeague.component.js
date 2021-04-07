import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import LeagueService from '../services/league.service';

export default class SelectLeagueComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      leagues: [],
      league: undefined,
    };
  }

  componentDidMount() {
    this.loadLeagues();
  }

  async loadLeagues() {
    const leagues = await LeagueService.getActiveLeagues();
    let selectedLeague;
    let redirect;

    const leaguesOptions = leagues.map((league) => {
      if (league.league.isTheMostActive) {
        selectedLeague = league.league.id;
        if (window.location.pathname === '/dashboard') redirect = `/dashboard/${league.league.id}/matches`;
      }
      return {
        key: league.league.id,
        text: league.league.name,
        value: league.league.id,
      };
    });

    this.setState({
      leagues: leaguesOptions,
      league: selectedLeague,
      redirect,
    });
  }

  render() {
    const { redirect } = this.state;

    if (redirect) {
      this.setState({ redirect: undefined });
      return <Redirect to={redirect} />;
    }

    return (
      <Form.Select
        style={{ backgroundColor: '#202020', color: 'white', float: 'right' }}
        fluid
        options={this.state.leagues}
        value={this.state.league}
        onChange={(event, { value }) => {
          this.setState({
            league: value,
            redirect: `/dashboard/${value}/matches`,
          });
        }}
      />
    );
  }
}
