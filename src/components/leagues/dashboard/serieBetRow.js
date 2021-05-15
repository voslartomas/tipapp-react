import React, { useState, useEffect } from "react";
import { Dropdown, Button } from "semantic-ui-react";
import { getArrowIcon, loadingComponent } from "../../../helpers/utils";
import moment from "moment";
import UserBetsSerieService from "../../../services/userBetsSerie.service";

export default function SerieBetRow({
  betProp,
  canBetOnSpecial,
  reload,
  isToggledBet,
  onClickHandler,
  leagueId,
}) {
  const [bet, setBet] = useState(betProp);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isOriginalBet = () => {
    return (
      bet.homeTeamScore == betProp.homeTeamScore &&
      bet.awayTeamScore == betProp.awayTeamScore
    );
  };

  useEffect(() => setBet(betProp), [betProp]);

  const submitSerieBet = async () => {
    setIsLoading(true);
    await UserBetsSerieService.put(
      leagueId,
      {
        homeTeamScore: bet.homeTeamScore,
        awayTeamScore: bet.awayTeamScore,
        leagueSpecialBetSerieId: bet.leagueSpecialBetSerieId,
      },
      bet.id || 0
    );
    setIsLoading(false);
    setIsEditing(false);
    reload();
  };

  return (
    <React.Fragment>
      {loadingComponent(isLoading)}
      <tr onClick={() => !canBetOnSpecial && onClickHandler(bet)}>
        <td>
          {bet.homeTeam} - {bet.awayTeam}
        </td>
        <td>
          {canBetOnSpecial && (
            <span>Konec {moment(bet.endDate).fromNow()}</span>
          )}
        </td>
        <td>
          {bet.serieHomeScore}:{bet.serieAwayScore}
        </td>
        <td>
          {(!canBetOnSpecial || (canBetOnSpecial && !isEditing)) && (
            <span>
              {bet.homeTeamScore}:{bet.awayTeamScore}
            </span>
          )}
          {canBetOnSpecial && isEditing && (
            <span>
              <input
                value={bet.homeTeamScore || 0}
                type="number"
                onChange={(e) => {
                  const newBet = Object.assign({}, bet);
                  newBet.homeTeamScore = e.target.value || 0;
                  setBet(newBet);
                }}
                name="homeScore"
                min="0"
                max="4"
                style={{ width: "35px" }}
              />
              :
              <input
                value={bet.awayTeamScore || 0}
                type="number"
                onChange={(e) => {
                  const newBet = Object.assign({}, bet);
                  newBet.awayTeamScore = e.target.value || 0;
                  setBet(newBet);
                }}
                name="awayScore"
                min="0"
                max="4"
                style={{ width: "35px" }}
              />
            </span>
          )}
        </td>
        <td>
          {!isEditing && <b>{bet.totalPoints}</b>}
          {isEditing && (
            <Button.Group>
              <Button
                disabled={isOriginalBet()}
                color="yellow"
                icon="check"
                onClick={() => submitSerieBet()}
              />
              <Button
                icon="cancel"
                onClick={() => {
                  setBet(betProp);
                  setIsEditing(false);
                }}
              />
            </Button.Group>
          )}
        </td>
        {!canBetOnSpecial && <td>{getArrowIcon(isToggledBet)}</td>}
        {canBetOnSpecial && !isEditing && (
          <td>
            <Button
              inverted
              color="yellow"
              icon="pencil alternate"
              onClick={() => setIsEditing(true)}
            />
          </td>
        )}
        {canBetOnSpecial && isEditing && <td />}
      </tr>
    </React.Fragment>
  );
}