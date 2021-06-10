import React, { useState, useEffect, useContext } from 'react'
import { Button } from 'semantic-ui-react'
import LeagueService from '../../../services/league.service'
import PlayerService from '../../../services/player.service'
import { canBetOnMatch, loadingComponent } from '../../../helpers/utils';
import CurrentTimestampContext from '../../../context/CurrentTimestampContext'
import MatchBetRow from './matchBetRow'

export default function MatchBetsComponent({ leagueId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [matchBets, setMatchBets] = useState([]);
  const [players, setPlayers] = useState([]);
  const [history, setHistory] = useState(false);
  const [toggledGames, setToggleGames] = useState([]);
  const [otherPeopleBets, setOtherPeopleBets] = useState([]);

  useEffect(async () => {
    await loadBets();
  }, [history, leagueId]);

  const currentTimeStamp = useContext(CurrentTimestampContext);

  const getPlayers = (match) => {
    return players
      .filter(player => player.leagueTeamId === match.homeTeamId ||
        player.leagueTeamId === match.awayTeamId)
      .map(player => ({
        key: player.id,
        text: `${player.player.firstName} ${player.player.lastName}${addStarsForBestScorers(player)} ${player.player.position ? `(${player.player.position})` : ''} (${player.leagueTeam.team.shortcut}, Z: ${player.seasonGames || 0}, G: ${player.seasonGoals || 0})`,
        value: player.id,
      }))
  };

  const loadBets = async () => {
    setIsLoading(true);
    const matches = history ?
      await LeagueService.getBetsMatchesHistory(leagueId) :
      await LeagueService.getBetsMatches(leagueId);

    const teams = []
    for (const match of matches) {
      if (canBetOnMatch(match, currentTimeStamp)) {
        teams.push(match.awayTeamId, match.homeTeamId)
      }
    }

    const _players = await PlayerService.getPlayersByTeams(leagueId, teams)
    setMatchBets(matches);
    setPlayers(_players);
    setIsLoading(false);
  }

  const toggleHistory = () => setHistory(!history);

  const isToggledGame = betId => toggledGames.includes(betId);

  const loadOtherBets = async (bet) => {
    setIsLoading(true)
    await LeagueService.getUserBetsMatch(leagueId, bet.matchId).then((x) => {
      setOtherPeopleBets(otherPeopleBets.concat({
        matchId: bet.matchId,
        bets: x,
      }));
      setIsLoading(false);
    });
  }

  const onClickHandler = async (bet) => {
    if (!isToggledGame(bet.id) &&
      !otherPeopleBets.find(x => x.matchId === bet.matchId)) {
      await loadOtherBets(bet);
    }
    setToggleGames(isToggledGame(bet.id) ? toggledGames.filter(x => x !== bet.id) : toggledGames.concat(bet.id));
  }

  const addStarsForBestScorers = (player) => {
    let stars = ''
    if (player.bestScorer) {
      return stars += ' *'
    }
    if (player.secondBestScorer) {
      return stars += ' **'
    }
    if (player.thirdBestScorer) {
      return stars += ' ***'
    }
    if (player.fourthBestScorer) {
      return stars += ' ****'
    }
    return stars
  }

  const otherBets = (bet) => {
    const other = otherPeopleBets.find(x => x.matchId === bet.matchId)
    const _other = other.bets.filter(y => y.leagueUserId !== bet.leagueUserId)
    return (
      <React.Fragment>
        {_other.map((b, i) => (
          <tr key={`${b.id}_1`} style={{ padding: 0, marginTop: i === 0 ? '-15px' : 0, marginBottom: (i + 1) === _other.length ? '20px' : 0 }}>
            <td style={{ flex: 14, background: 'none' }} />
            <td style={{ flex: 14, background: 'none' }} />
            <td style={{ flex: 24 }}>{`${b.user.user.firstName} ${b.user.user.lastName}`}</td>
            <td style={{ flex: 10 }} >{b.homeScore}:{b.awayScore}{b.overtime ? 'P' : ''}</td>
            <td style={{ flex: 20 }} >{b.scorer ? `${b.scorer.player.firstName} ${b.scorer.player.lastName}` : ''}</td>
            <td style={{ flex: 14 }}>{b.totalPoints}</td>
            <td style={{ flex: 3, background: 'none' }} />
          </tr>
      ))}
      </React.Fragment>
    )
  }

  return (
    <div className="page">
      {loadingComponent(isLoading)}
      <div style={{ padding: '10px 0 20px' }}>
        <Button onClick={() => { toggleHistory() }}>{!history ? 'Zobrazit historii' : 'Zobrazit nadcházející'}</Button>
      </div>
      <table className="flex-table">
        <thead>
          <tr>
            <th className="matchNameColumn">Zápas</th>
            <th className="matchDateColumn">Datum</th>
            <th className="matchResultColumn">Výsledek</th>
            <th className="matchBetColumn">Tip</th>
            <th className="matchScorerColumn">Střelec</th>
            <th className="matchPointsColumn">Body</th>
            <th className="matchIconColumn" />
          </tr>
        </thead>
        <tbody>
          {matchBets
            .filter(m => m.homeTeamId !== 220 && m.awayTeamId !== 220) // filtering out Vancoouver games
            .map((bet, index) => (
              <React.Fragment key={`${bet.id}_${index}`}>
                <MatchBetRow betProp={bet} players={getPlayers(bet)} canBetOnMatch={canBetOnMatch(bet, currentTimeStamp)} isToggledGame={isToggledGame(bet.id)} onClickHandler={onClickHandler} leagueId={leagueId} reload={loadBets} />
                {isToggledGame(bet.id) && otherBets(bet)}
              </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
