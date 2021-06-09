import React, { useState, useEffect, useContext } from "react";
import { canBetOnSpecial, loadingComponent } from "../../../helpers/utils";
import UserBetsSingleService from "../../../services/userBetsSingle.service";
import PlayerService from "../../../services/player.service";
import LeagueService from "../../../services/league.service";
import CurrentTimestampContext from "../../../context/CurrentTimestampContext";
import SpecialBetRow from "./specialBetRow";

export default function SingleBetsComponent({ leagueId }) {
  const [singleBets, setSingleBets] = useState([]);
  const [playersOptions, setPlayersOptions] = useState([]);
  const [teamsOptions, setTeamOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toggledBets, setToggleBets] = useState([]);
  const [otherPeopleBets, setOtherPeopleBets] = useState([]);

  const currentTimeStamp = useContext(CurrentTimestampContext);

  useEffect(async () => {
    setIsLoading(true);
    const players = await PlayerService.getPlayers(leagueId, []);
    const teams = await LeagueService.getTeams(leagueId);

    const _playersOptions = players.map((player) => ({
      key: player.id,
      text: `${player.player.firstName} ${player.player.lastName}`,
      value: player.id,
    }));

    const _teamsOptions = teams.map((team) => ({
      key: team.id,
      text: team.team.name,
      value: team.id,
    }));

    setPlayersOptions(_playersOptions);
    setTeamOptions(_teamsOptions);

    await loadBets();
    setIsLoading(false);
  }, [leagueId]);

  const loadBets = async () => {
    setIsLoading(true);
    const bets = await UserBetsSingleService.getAll(leagueId);
    setSingleBets(bets);
    setIsLoading(false);
  };

  const isToggledBet = (betId) => toggledBets.includes(betId);

  const loadOtherBets = async (bet) => {
    setIsLoading(true);
    await LeagueService.getUserBetsSingle(
      leagueId,
      bet.leagueSpecialBetSingleId
    ).then((x) => {
      setOtherPeopleBets(
        otherPeopleBets.concat({
          betId: bet.betId,
          bets: x,
        })
      );
      setIsLoading(false);
    });
  };

  const onClickHandler = async (bet) => {
    if (
      !isToggledBet(bet.id) &&
      !otherPeopleBets.find((x) => x.betId === bet.betId)
    ) {
      await loadOtherBets(bet);
    }
    setToggleBets(
      isToggledBet(bet.id)
        ? toggledBets.filter((x) => x !== bet.id)
        : toggledBets.concat(bet.id)
    );
  };

  const otherBets = (bet) => {
    const other = otherPeopleBets.find((x) => x.betId === bet.betId);
    const _other = other.bets.filter(y => y.leagueUserId !== bet.leagueUserId)
    return (
      <React.Fragment>
        {_other.map((b, i) => (
            <tr key={`${b.id}_1`} style={{ padding: 0, marginTop: i === 0 ? '-15px' : 0, marginBottom: (i + 1) === _other.length ? '20px' : 0 }}>
              <td style={{ flex: 20, background: 'none' }} />
              <td style={{ flex: 15, background: 'none' }} />
              <td style={{ flex: 35 }}>{`${b.leagueUser.user.firstName} ${b.leagueUser.user.lastName}`}</td>
              <td style={{ flex: 15 }}>
                {" "}
                {b.teamResult && b.teamResult.team.name}
                {b.playerResult &&
                  `${b.playerResult.player.firstName} ${b.playerResult.player.lastName}`}
                {b.value && b.value}
              </td>

              <td style={{ flex: 10 }}>{b.totalPoints}</td>
              <td style={{ flex: 5, background: 'none' }} />
            </tr>
          ))}
      </React.Fragment>
    );
  };

  return (
    <div className="page">
      {loadingComponent(isLoading)}
      <table className="flex-table">
        <thead>
          <tr>
            <th className="specialNameColumn">Zápas</th>
            <th className="specialDateColumn">Datum</th>
            <th className="specialResultColumn">Výsledek</th>
            <th className="specialBetColumn">Tip</th>
            <th className="specialPointsColumn">Body</th>
            <th className="specialIconColumn" />
          </tr>
        </thead>
        <tbody>
          {singleBets
            .sort(
              (a, b) =>
                // new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
                a.singleId - b.singleId,
            )
            .map((bet, index) => (
              <React.Fragment key={`${bet.id}_${index}`}>
                {
                  <SpecialBetRow
                    betProp={bet}
                    canBetOnSpecial={canBetOnSpecial(bet, currentTimeStamp)}
                    reload={loadBets}
                    isToggledBet={isToggledBet(bet.id)}
                    onClickHandler={onClickHandler}
                    leagueId={leagueId}
                    playersOptions={playersOptions}
                    teamsOptions={teamsOptions}
                  />
                }
                {isToggledBet(bet.id) && otherBets(bet)}
              </React.Fragment>
            ))}
        </tbody>
      </table>
    </div>
  );
}
