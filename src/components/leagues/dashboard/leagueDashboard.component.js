import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import SerieBetsComponent from './serieBets.component'
import SingleBetsComponent from './singleBets.component'
import MatchBetsComponent from './matchBets.component'
import LeaderBoardComponent from './leaderBoard.component'
import SelectedLeagueContext from '../../../context/SelectedLeagueContext'

export default function LeagueDashboardComponent(props) {
  const { selectedLeague } = useContext(SelectedLeagueContext);

  if (!selectedLeague) return (<React.Fragment />);

  return (
    <div>
      <div className="league-bar">
        <ul>
          <li><Link to={`/dashboard/${selectedLeague}/matches`}>Zápasy</Link></li>
          <li><Link to={`/dashboard/${selectedLeague}/singles`}>Speciální</Link></li>
          <li><Link to={`/dashboard/${selectedLeague}/series`}>Série</Link></li>
          <li><Link to={`/dashboard/${selectedLeague}/leaderBoard`}>Tabulka</Link></li>
        </ul>
        <div style={{ clear: 'both' }} />
      </div>
      {props.section === 'series' && <SerieBetsComponent leagueId={selectedLeague} />}
      {props.section === 'singles' && <SingleBetsComponent leagueId={selectedLeague} />}
      {props.section === 'matches' && <MatchBetsComponent leagueId={selectedLeague} />}
      {props.section === 'leaderboard' && <LeaderBoardComponent leagueId={selectedLeague} />}
    </div>
  )
  
}
