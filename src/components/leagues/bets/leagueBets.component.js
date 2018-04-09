import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { Tab } from 'semantic-ui-react'
import SpecialBetsSingleComponent from './specialBetsSingle.component'
import SpecialBetsSerieComponent from './specialBetsSerie.component'

export default class LeagueBetsComponent extends Component {
  constructor(props) {
    super(props)

    if (this.props.match.params.type === 'serie') {
        this.state = { activeIndex: 0 }
    } else {
      this.state = { activeIndex: 1 }
    }

    this.panes = [
      { menuItem: 'Série', render: () => <Tab.Pane><SpecialBetsSerieComponent match={this.props.match} /></Tab.Pane> },
      { menuItem: 'Speciální', render: () => <Tab.Pane><SpecialBetsSingleComponent match={this.props.match} /></Tab.Pane> },
    ]
  }

  onTabChanged = (e, { activeIndex }) => {
    if (activeIndex === 0) {
      this.props.history.push(`/leagues/${this.props.match.params.leagueId}/bets/serie`)
    } else {
      this.props.history.push(`/leagues/${this.props.match.params.leagueId}/bets/single`)
    }

    this.setState({ activeIndex })
  }

  render() {
    return (
      <Tab panes={this.panes} onTabChange={this.onTabChanged} activeIndex={this.state.activeIndex} />
    )
  }
}
