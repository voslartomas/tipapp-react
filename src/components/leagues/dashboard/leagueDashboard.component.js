import React, { Component } from 'react'
import { Menu, Segment, Sidebar, Icon, Header, Card, Button } from 'semantic-ui-react'
import { Route, Link } from 'react-router-dom'
import SerieBetsComponent from './serieBets.component'
import SingleBetsComponent from './singleBets.component'
import BetsSerieService from '../../../services/betsSerie.service'
import UserBetsSerieService from '../../../services/userBetsSerie.service'

export default class LeagueDashboardComponent extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <h1>Sázky</h1>
        <SerieBetsComponent match={this.props.match} />

        <SingleBetsComponent match={this.props.match} />
      </div>
    )
  }
}
