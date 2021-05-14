import { Button } from 'semantic-ui-react'
import moment from 'moment'
import React, { useState, useEffect, useContext } from 'react'
import { canBetOnSpecial, loadingComponent, getArrowIcon } from '../../../helpers/utils'
import LeagueService from '../../../services/league.service'
import UserBetsSerieService from '../../../services/userBetsSerie.service'
import CurrentTimestampContext from '../../../context/CurrentTimestampContext'

export default function SerieBetsComponent({ leagueId }) {
  const [serieBets, setSerieBets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toggledBets, setToggleBets] = useState([]);
  const [otherPeopleBets, setOtherPeopleBets] = useState([]);

  useEffect(async () => {
    await loadBets();
  }, [leagueId])

  const currentTimeStamp = useContext(CurrentTimestampContext);

  const loadBets = async () => {
    setIsLoading(true)
    const userBets = await LeagueService.getBetsSeries(leagueId)
    setSerieBets(userBets);
    setIsLoading(false)
  }

  const submitSerieBet = async (bet) => {
    await UserBetsSerieService.put(leagueId, {
      homeTeamScore: bet.homeTeamScore,
      awayTeamScore: bet.awayTeamScore,
      leagueSpecialBetSerieId: bet.leagueSpecialBetSerieId
    }, bet.id || 0)

    await loadBets()
  }

  const handleBetChange = async (bet, event) => {
    setSerieBets(serieBets.map((s) => {
      if (s.id === bet.id) {
        s.homeTeamScore = event.target.name === 'homeScore' ? parseInt(event.target.value) : bet.homeTeamScore || 0
        s.awayTeamScore = event.target.name === 'awayScore' ? parseInt(event.target.value) : bet.awayTeamScore || 0
      }
      return s;
    }))
  }

  const loadOtherBets = async (bet) => {
    setIsLoading(true);
    await LeagueService.getUserBetsSerie(leagueId, bet.leagueSpecialBetSerieId).then(x => {
      setOtherPeopleBets(otherPeopleBets.concat({
          betId: bet.id,
          bets: x,
      }));
      setIsLoading(false);
    });
  }

  const isToggledBet = betId => toggledBets.includes(betId);
  
  const onClickHandler = async (bet) => {
    if (!isToggledBet(bet.id) &&
      !otherPeopleBets.find(x => x.betId === bet.id)) {
      await loadOtherBets(bet)
    }
    setToggleBets(isToggledBet(bet.id) ? toggledBets.filter(x => x !== bet.id) : toggledBets.concat(bet.id));
  }

  const otherBets = (bet) => {
    const other = otherPeopleBets.find(x => x.betId === bet.id);

    return (
      <React.Fragment>
        {other.bets.filter(y => y.leagueUserId !== bet.leagueUserId).map((b,index) => (
          <tr key={bet.id+index}>
            <td>{`${b.leagueUser.user.firstName} ${b.leagueUser.user.lastName}`}</td>
            <td />
            <td />
            <td>{b.homeTeamScore}:{b.awayTeamScore}</td>
            <td>{b.totalPoints}</td>
          </tr>
      ))}
      </React.Fragment>
    )
  }

  const betRow = (bet) => {
    return (<tr onClick={() => !canBetOnSpecial(bet, currentTimeStamp) && onClickHandler(bet)}>
      <td align="left">{!canBetOnSpecial(bet, currentTimeStamp) && getArrowIcon(isToggledBet(bet.id))} {bet.homeTeam} - {bet.awayTeam}</td>
      <td>{canBetOnSpecial(bet, currentTimeStamp) && <span>Konec {moment(bet.endDate).fromNow()}</span>}</td>
      <td>{bet.serieHomeScore}:{bet.serieAwayScore}</td>
      <td>
        {canBetOnSpecial(bet, currentTimeStamp) && <span>
        <input
          value={(bet.homeTeamScore) || 0}
          type="number"
          onChange={e => handleBetChange(bet, e)}
          name="homeScore"
          min="0"
          max="4"
          style={{ width: '35px' }} />:
        <input
          value={(bet.awayTeamScore) || 0}
          type="number"
          onChange={e => handleBetChange(bet, e)}
          name="awayScore"
          min="0"
          max="4"
          style={{ width: '35px' }} />
        </span>}
        {canBetOnSpecial(bet, currentTimeStamp) && <Button onClick={() => submitSerieBet(bet)}>Uložit sázku</Button>}

        </td>
      <td><b>{bet.id && bet.totalPoints}</b></td>
    </tr>)
  }

  return (
    <div className="page">
      {loadingComponent(isLoading)}
      <table>
        <tbody>
          <tr>
            <th width="35%">Zápas</th>
            <th width="10%">Datum</th>
            <th width="10%">Výsledek</th>
            <th width="10%">Tip</th>
            <th width="5%">Body</th>
          </tr>
          {serieBets.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()).map((bet, index) => (
            <React.Fragment key={`${bet.id}_${index}`}>
              {betRow(bet)}
              {isToggledBet(bet.id) && otherBets(bet)}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
