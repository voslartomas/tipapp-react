import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SerieBetsComponent from './serieBets.component';
import SingleBetsComponent from './singleBets.component';
import MatchBetsComponent from './matchBets.component';
import LeaderBoardComponent from './leaderBoard.component';

export default class LeagueDashboardComponent extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <div>
        <div className="league-bar">
          <ul>
            <li>
              <Link to={`/dashboard/${this.props.match.params.leagueId}/matches`}>Zápasy</Link>
            </li>
            <li>
              <Link to={`/dashboard/${this.props.match.params.leagueId}/singles`}>Speciální</Link>
            </li>
            <li>
              <Link to={`/dashboard/${this.props.match.params.leagueId}/series`}>Série</Link>
            </li>
            <li>
              <Link to={`/dashboard/${this.props.match.params.leagueId}/leaderBoard`}>Tabulka</Link>
            </li>
          </ul>
          <div style={{ clear: 'both' }} />
        </div>

        {this.props.section === 'series' && (
          <SerieBetsComponent match={this.props.match} id={this.props.match.params.leagueId} />
        )}
        {this.props.section === 'singles' && (
          <SingleBetsComponent match={this.props.match} id={this.props.match.params.leagueId} />
        )}
        {this.props.section === 'matches' && (
          <MatchBetsComponent match={this.props.match} id={this.props.match.params.leagueId} />
        )}

        {this.props.section === 'leaderboard' && (
          <LeaderBoardComponent match={this.props.match} id={this.props.match.params.leagueId} />
        )}
      </div>
    );
  }
}
