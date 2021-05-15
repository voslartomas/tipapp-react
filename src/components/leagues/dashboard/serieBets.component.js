import React, { useState, useEffect, useContext } from 'react'
import { canBetOnSpecial, loadingComponent } from '../../../helpers/utils'
import LeagueService from '../../../services/league.service'
import CurrentTimestampContext from '../../../context/CurrentTimestampContext'
import SerieBetRow from './serieBetRow'

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
            <td />
          </tr>
      ))}
      </React.Fragment>
    )
  }

  return (
    <div className="page">
      {loadingComponent(isLoading)}
      <table>
        <tbody>
          <tr>
            <th width="35%">Zápas</th>
            <th width="22%">Datum</th>
            <th width="15%">Výsledek</th>
            <th width="15%">Tip</th>
            <th width="10%">Body</th>
            <th width="3%" />
          </tr>
          {serieBets.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()).map((bet, index) => (
            <React.Fragment key={`${bet.id}_${index}`}>
              {<SerieBetRow betProp={bet} canBetOnSpecial={canBetOnSpecial(bet, currentTimeStamp)} reload={loadBets} isToggledBet={isToggledBet(bet.id)} onClickHandler={onClickHandler} leagueId={leagueId} />}
              {isToggledBet(bet.id) && otherBets(bet)}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
