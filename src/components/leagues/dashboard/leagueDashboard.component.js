import React, { Component } from 'react'
import { Menu, Segment, Sidebar, Icon, Header, Card, Button } from 'semantic-ui-react'
import { Route, Link } from 'react-router-dom'
import SerieBetsComponent from './serieBets.component'
import SingleBetsComponent from './singleBets.component'
import MatchBetsComponent from './matchBets.component'
import BetsSerieService from '../../../services/betsSerie.service'
import UserBetsSerieService from '../../../services/userBetsSerie.service'
import LeaderBoardComponent from './leaderBoard.component'

export default class LeagueDashboardComponent extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <div class="league-bar">
          <ul>
              <li><a href="#" class="my-bets">Sázky</a></li>
              <li><a href="#" class="table">Tabulka</a></li>
          </ul>
          <div style={{clear: 'both'}}></div>
        </div>

        <SerieBetsComponent match={this.props.match} id={this.props.match.params.leagueId} />
        <SingleBetsComponent match={this.props.match} id={this.props.match.params.leagueId} />
        <MatchBetsComponent match={this.props.match} id={this.props.match.params.leagueId} />

        <LeaderBoardComponent match={this.props.match} id={this.props.match.params.leagueId} />
      </div>
    )
  }
}
