import { Button } from 'semantic-ui-react'
import React, { useState, useEffect, useContext } from 'react'
import { canBetOnSpecial, loadingComponent, getArrowIcon } from '../../../helpers/utils'
import LeagueService from '../../../services/league.service'
import UserBetsSerieService from '../../../services/userBetsSerie.service'
import CurrentTimestampContext from '../../../context/CurrentTimestampContext'

export default function SerieBetsComponent(props) {
  const [serieBets, setSerieBets] = useState([]);
  const [leagueId, setLeagueId] = useState(props.id);
  const [isLoading, setIsLoading] = useState(false);
  const [toggledBets, setToggleBets] = useState([]);
  const [otherPeopleBets, setOtherPeopleBets] = useState([]);

  useEffect(async () => {
    await loadBets();
  }, [leagueId])

  const currentTimeStamp = useContext(CurrentTimestampContext);

  const loadBets = async () => {
    setIsLoading(true)
    const userBets = await LeagueService.getBetsSeries(props.match.params.leagueId)
    setSerieBets(userBets);
    setLeagueId(props.match.params.leagueId)
    setIsLoading(false)
  }

  const submitSerieBet = async (bet) => {
    await UserBetsSerieService.put(props.match.params.leagueId, {
      homeTeamScore: bet.homeTeamScore,
      awayTeamScore: bet.awayTeamScore,
      leagueSpecialBetSerieId: bet.leagueSpecialBetSerieId
    }, bet.id || 0)

    await loadBets()
  }

  const handleBetChange = async (bet, event) => {
    setIsLoading(true);
    bet.homeTeamScore = event.target.name === 'homeScore' ? parseInt(event.target.value) : bet.homeTeamScore || 0
    bet.awayTeamScore = event.target.name === 'awayScore' ? parseInt(event.target.value) : bet.awayTeamScore || 0
    setIsLoading(false);
  }

  const loadOtherBets = async (bet) => {
    setIsLoading(true);
    await LeagueService.getUserBetsSerie(props.match.params.leagueId, bet.leagueSpecialBetSerieId).then(x => {
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
      <table>
        <tbody>
          <tr>
            <th width="40%">Zápas</th>
            <th width="10%">Výsledek</th>
            <th width="10%">Tip</th>
            <th width="10%">Body</th>
          </tr>
          {loadingComponent(isLoading)}
          {serieBets.map(bet => (
            <React.Fragment key={bet.betId}>
              {betRow(bet)}
              {isToggledBet(bet.id) && otherBets(bet)}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
