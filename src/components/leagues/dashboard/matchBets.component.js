import React, { useState, useEffect, useContext } from 'react'
import { Form, Button } from 'semantic-ui-react'
import moment from 'moment'
import LeagueService from '../../../services/league.service'
import UserBetsMatchService from '../../../services/userBetsMatch.service'
import PlayerService from '../../../services/player.service'
import { canBetOnMatch, getArrowIcon, loadingComponent } from '../../../helpers/utils';
import CurrentTimestampContext from '../../../context/CurrentTimestampContext'

export default function MatchBetsComponent({ leagueId }) {
  const [isLoading, setIsLoading] = useState([]);
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
        text: `${player.player.firstName} ${player.player.lastName}${addStarsForBestScorers(player)} (${player.leagueTeam.team.shortcut}, Z: ${player.seasonGames}, G: ${player.seasonGoals})`,
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

  const handleBetChange = async (bet, value, type, scorerId = undefined) => {
    if (!scorerId) {
      scorerId = bet.scorerId;
    }

    await UserBetsMatchService.put(leagueId, {matchId: bet.matchId1,
      homeScore: type === 'homeScore' ? parseInt(value) : bet.homeScore || 0,
      awayScore: type === 'awayScore' ? parseInt(value) : bet.awayScore || 0,
      overtime: type === 'overtime' ? value : bet.overtime || false,
      scorerId }, bet.id)

    await loadBets();
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
    return (
      <React.Fragment>
        {other.bets.filter(y => y.leagueUserId !== bet.leagueUserId).map(b => (
          <tr key={`${b.id}_1`}>
            <td>{`${b.user.user.firstName} ${b.user.user.lastName}`}</td>
            <td />
            <td />
            <td>{b.homeScore}:{b.awayScore}</td>
            <td>{`${b.scorer.player.firstName} ${b.scorer.player.lastName}`}</td>
            <td>{b.totalPoints}</td>
          </tr>
      ))}
      </React.Fragment>
    )
  }

  const betRow = (bet) => {
    return (
      <tr key={bet.id} onClick={() => !canBetOnMatch(bet, currentTimeStamp) && onClickHandler(bet)}>
        <td align="left">
          {!canBetOnMatch(bet, currentTimeStamp) && getArrowIcon(isToggledGame(bet.id))} {bet.homeTeam} - {bet.awayTeam}
        </td>
        <td>{moment(bet.matchDateTime).fromNow()}</td>
        <td>{bet.matchHomeScore}:{bet.matchAwayScore}{bet.matchOvertime ? 'P' : ''}</td>
        <td>{!canBetOnMatch(bet, currentTimeStamp) && <div>{bet.homeScore}:{bet.awayScore}</div>}
          {canBetOnMatch(bet, currentTimeStamp) && <div>
            <input value={bet.homeScore || 0} type="number" name="homeScore" min="0" style={{ width: '35px' }} onChange={e => handleBetChange(bet, e.target.value, 'homeScore')} />:
            <input value={bet.awayScore || 0} type="number" name="awayScore" min="0" style={{ width: '35px' }} onChange={e => handleBetChange(bet, e.target.value, 'awayScore')} />
            <input type="checkbox" title="Prodloužení" checked={bet.overtime} onChange={e => handleBetChange(bet, e.target.checked, 'overtime')} />
          </div>}
        </td>
        <td>{!canBetOnMatch(bet, currentTimeStamp) && <span>{bet.scorer}</span>}
          {canBetOnMatch(bet, currentTimeStamp) && <Form.Field>
            {<Form.Select
              fluid
              required
              search
              value={bet.scorerId}
              options={getPlayers(bet)}
              placeholder="Vyberte hráče"
              onChange={(e, { name, value }) => {
                handleBetChange(bet, e, 'scorer', value)
              }}
            />}
          </Form.Field>}
        </td>
        <td><b>{bet.totalPoints}</b></td>
      </tr>
    )
  }

  return (
    <div className="page">
      {loadingComponent(isLoading)}
      <div style={{ padding: '10px 0 20px' }}>
        <Button onClick={() => { toggleHistory() }}>{!history ? 'Zobrazit historii' : 'Zobrazit nadcházející'}</Button>
      </div>
      <table>
        <tbody>
          <tr>
            <th width="35%">Zápas</th>
            <th width="13%">Datum</th>
            <th width="12%">Výsledek</th>
            <th width="12%">Tip</th>
            <th width="20%">Střelec</th>
            <th width="8%">Body</th>
          </tr>
          {matchBets.map((bet, index) => (
            <React.Fragment key={`${bet.id}_${index}`}>
              {betRow(bet)}
              {isToggledGame(bet.id) && otherBets(bet)}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
