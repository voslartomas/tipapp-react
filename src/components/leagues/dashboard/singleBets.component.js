import React, { useState, useEffect, useContext } from 'react'
import { Menu, Segment, Sidebar, Icon, Header, Card, Button, Form } from 'semantic-ui-react'
import { Route, Link } from 'react-router-dom'
import moment from 'moment'
import { canBetOnSpecial, getArrowIcon, loadingComponent } from '../../../helpers/utils'
import UserBetsSingleService from '../../../services/userBetsSingle.service'
import PlayerService from '../../../services/player.service'
import LeagueService from '../../../services/league.service'
import CurrentTimestampContext from '../../../context/CurrentTimestampContext'

export default function SingleBetsComponent(props) {
  const [userBets, setUserBets] = useState({});
  const [singleBets, setSingleBets] = useState([]);
  const [playersOptions, setPlayersOptions] = useState([]);
  const [teamsOptions, setTeamOptions] = useState([]);
  const [leagueId, setLeagueId] = useState(props.id);
  const [isLoading, setIsLoading] = useState(false);
  const [toggledBets, setToggleBets] = useState([]);
  const [otherPeopleBets, setOtherPeopleBets] = useState([]);

  const currentTimeStamp = useContext(CurrentTimestampContext);

  useEffect(async () => {
    setIsLoading(true);
    const players = await PlayerService.getPlayers(props.match.params.leagueId, [])
    const teams = await LeagueService.getTeams(props.match.params.leagueId)

    const _playersOptions = players.map(player => ({
      key: player.id,
      text: `${player.player.firstName} ${player.player.lastName}`,
      value: player.id,
    }))

    const _teamsOptions = teams.map(team => ({
      key: team.id,
      text: team.team.name,
      value: team.id,
    }))

    setPlayersOptions(_playersOptions);
    setTeamOptions(_teamsOptions);
    setLeagueId(props.id);

    await loadBets()
    setIsLoading(false);
  }, [leagueId])

  const loadBets = async () => {
    setIsLoading(true);
    const bets = await UserBetsSingleService.getAll(props.match.params.leagueId)
    setSingleBets(bets);
    setIsLoading(false);
  }

  const getResult = (bet) => {
    if (bet.valueBet) {
      return bet.valueBet
    } else if (bet.playerBet) {
      return `${bet.playerBet}`
    } else if (bet.teamBet) {
      return bet.teamBet
    }
  }

  const submitBet = async (bet) => {
    const value = userBets[bet.singleId]

    if (value) {
      let data = {
        leagueSpecialBetSingleId: bet.singleId
      }

      if (bet.type === 1) {
        data['playerResultId'] = value
      } else if (bet.type === 2) {
        data['teamResultId'] = value
      } else if (bet.type === 3) {
        data['value'] = value
      }

      await UserBetsSingleService.put(props.match.params.leagueId, data, bet.id | 0)
      await loadBets();
    }
  }

  const handleChange = (bet, value) => {
    const _userBets = userBets
    _userBets[bet.singleId] = value
    setUserBets(_userBets)
  }

  const isToggledBet = (betId) => toggledBets.includes(betId);

  const loadOtherBets = async (bet) => {
    setIsLoading(true)
    await LeagueService.getUserBetsSingle(props.match.params.leagueId, bet.leagueSpecialBetSingleId).then(x => {
      setOtherPeopleBets(otherPeopleBets.concat({
          betId: bet.betId,
          bets: x,
        }),
      )
      setIsLoading(false)
    });
  }

  const onClickHandler = async (bet) => {
    if (!isToggledBet(bet.id) &&
      !otherPeopleBets.find(x => x.betId === bet.betId)) {
      await loadOtherBets(bet)
    }
    setToggleBets(isToggledBet(bet.id) ? toggledBets.filter(x => x !== bet.id) : toggledBets.concat(bet.id))
  }

  const otherBets = (bet) => {
    const other = otherPeopleBets.find(x => x.betId === bet.betId)

    return (
      <React.Fragment>
         {other.bets.filter(y => y.leagueUserId !== bet.leagueUserId).map((b,index) => (
          <tr key={bet.id+index}>
            <td>{`${b.leagueUser.user.firstName} ${b.leagueUser.user.lastName}`}</td>
            <td></td>
            <td></td>
            <td>        {b.teamResult && b.teamResult.team.name}
        {b.playerResult && `${b.playerResult.player.firstName} ${b.playerResult.player.lastName}`}
        {b.value && b.value}</td>
            
            <td>{b.totalPoints}</td>
          </tr>
      ))}
      </React.Fragment>
    )
  }

  const betRow = (bet) => {
    return (<tr onClick={() => !canBetOnSpecial(bet, currentTimeStamp) && onClickHandler(bet)}>
      <td>{!canBetOnSpecial(bet, currentTimeStamp) && getArrowIcon(isToggledBet(bet.id))} {bet.name}</td>
      <td>
        {bet.team && bet.team}
        {bet.player && bet.player}
        {bet.value && bet.value}
      </td>
      <td>{canBetOnSpecial(bet, currentTimeStamp) && <span>Konec {moment(bet.endDate).fromNow()}</span>}</td>
      <td>
      {getResult(bet)}
      {canBetOnSpecial(bet, currentTimeStamp) && <div>
        {bet.type === 1 && <Form.Field>
          <Form.Select
            fluid
            required
            onChange={(e, { name, value }) => handleChange(bet, value)}
            label="Hráč"
            search
            options={this.state.playersOptions}
            placeholder="Vyberte hráče"
          />
        </Form.Field>}
        {bet.type === 2 &&
          <Form.Field>
            <Form.Select
              fluid
              required
              label="Tým"
              onChange={(e, { name, value }) => handleChange(bet, value)}
              search
              options={teamsOptions}
              placeholder="Vyberte tým"
            />
          </Form.Field>}
        {bet.type === 3 && <span>
          <input onChange={(e) => handleChange(bet, e.target.value)} type="text" />
        </span>}
        <Button onClick={(e) => submitBet(bet)}>Uložit sázku</Button>
        </div>}
      </td>
      <td><b>{bet.id && bet.totalPoints}</b></td>
  </tr>)
  }

    return (
      <div className="page">
        <table>
          <tbody>
          <tr>
              <th width="40%">Název</th>
              <th width="10%">Výsledek</th>
              <th width="10%">Datum</th>
              <th width="10%">Tip</th>
              <th width="10%">Body</th>
          </tr>
          {loadingComponent(isLoading)}
          {singleBets.map((bet) => (
              <React.Fragment key={bet.id}>
                {betRow(bet)}
                {isToggledBet(bet.id) && otherBets(bet)}
              </React.Fragment>
          ))}
          </tbody>
        </table>
      </div>
    )
  
}