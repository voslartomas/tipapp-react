import React, { Component } from 'react';
import { Header, Divider, Loader } from 'semantic-ui-react';
import NHLService from '../../services/nhlService.service';

export default class SettingsComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  async import() {
    this.setState({ loading: true });
    await NHLService.import(this.props.match.params.leagueId);
    this.setState({ loading: false });
  }

  async updateMatches() {
    this.setState({ loading: true });
    await NHLService.updateMatches(this.props.match.params.leagueId);
    this.setState({ loading: false });
  }

  render() {
    return (
      <div>
        <Header as="h1">Nastavení</Header>
        <Divider />
        {this.state.loading && <Loader active>Loading</Loader>}

        <button onClick={() => this.import()}>Import NHL</button>
        <button onClick={() => this.updateMatches()}>Aktualizace výsledků</button>
      </div>
    );
  }
}
