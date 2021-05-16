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
    const _other = other.bets.filter(y => y.leagueUserId !== bet.leagueUserId)

    return (
      <React.Fragment>
        {_other.map((b,i) => (
          <tr key={`${b.id}_1`} style={{ padding: 0, marginTop: i === 0 ? '-15px' : 0, marginBottom: (i + 1) === _other.length ? '20px' : 0 }}>
            <td style={{ flex: 20, background: 'none' }} />
            <td style={{ flex: 15, background: 'none' }} />
            <td style={{ flex: 35 }}>{`${b.leagueUser.user.firstName} ${b.leagueUser.user.lastName}`}</td>
            <td style={{ flex: 15 }}>{b.homeTeamScore}:{b.awayTeamScore}</td>
            <td style={{ flex: 10 }}>{b.totalPoints}</td>
            <td style={{ flex: 5, background: 'none' }} />
          </tr>
      ))}
      </React.Fragment>
    )
  }

  return (
    <div className="page">
      {loadingComponent(isLoading)}
      <table className="flex-table">
        <thead>
          <tr>
            <th className="serieNameColumn">Zápas</th>
            <th className="serieDateColumn">Datum</th>
            <th className="serieResultColumn">Výsledek</th>
            <th className="serieBetColumn">Tip</th>
            <th className="seriePointsColumn">Body</th>
            <th className="serieIconColumn" />
          </tr>
        </thead>
        <tbody>
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
