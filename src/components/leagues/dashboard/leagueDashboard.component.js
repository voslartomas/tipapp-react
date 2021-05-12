import React from 'react'
import { Link } from 'react-router-dom'
import SerieBetsComponent from './serieBets.component'
import SingleBetsComponent from './singleBets.component'
import MatchBetsComponent from './matchBets.component'
import LeaderBoardComponent from './leaderBoard.component'

export default function LeagueDashboardComponent(props) {
  return (
    <div>
      <div className="league-bar">
        <ul>
          <li><Link to={`/dashboard/${props.match.params.leagueId}/matches`}>Zápasy</Link></li>
          <li><Link to={`/dashboard/${props.match.params.leagueId}/singles`}>Speciální</Link></li>
          <li><Link to={`/dashboard/${props.match.params.leagueId}/series`}>Série</Link></li>
          <li><Link to={`/dashboard/${props.match.params.leagueId}/leaderBoard`}>Tabulka</Link></li>
        </ul>
        <div style={{ clear: 'both' }} />
      </div>
      {props.section === 'series' && <SerieBetsComponent match={props.match} id={props.match.params.leagueId} />}
      {props.section === 'singles' && <SingleBetsComponent match={props.match} id={props.match.params.leagueId} />}
      {props.section === 'matches' && <MatchBetsComponent match={props.match} id={props.match.params.leagueId} />}
      {props.section === 'leaderboard' && <LeaderBoardComponent match={props.match} id={props.match.params.leagueId} />}
    </div>
  )
  
}
