import React, { useState, useEffect } from "react";
import { Dropdown, Button } from "semantic-ui-react";
import { getArrowIcon, loadingComponent } from "../../../helpers/utils";
import moment from "moment";
import UserBetsMatchService from "../../../services/userBetsMatch.service"

export default function MatchBetRow({
  betProp,
  players,
  canBetOnMatch,
  isToggledGame,
  onClickHandler,
  leagueId,
  reload,
}) {
  const [bet, setBet] = useState(betProp);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isOriginalBet = () => {
    return (
      bet.homeScore == betProp.homeScore &&
      bet.awayScore == betProp.awayScore &&
      bet.overtime === betProp.overtime &&
      bet.scorerId == betProp.scorerId
    );
  };

  useEffect(() => setBet(betProp), [betProp])

  const handleBetChange = async () => {
    setIsLoading(true);
    await UserBetsMatchService.put(
      leagueId,
      {
        matchId: bet.matchId1,
        homeScore: bet.homeScore || 0,
        awayScore: bet.awayScore || 0,
        overtime: bet.overtime || false,
        scorerId: bet.scorerId,
      },
      bet.id,
    );
    setIsLoading(false)
    reload()
    setIsEditing(false)
  };

  return (
    <React.Fragment>
      {loadingComponent(isLoading)}
      <tr key={bet.id} onClick={() => !canBetOnMatch && onClickHandler(bet)}>
        <td className="matchNameColumn">
          {bet.homeTeam} - {bet.awayTeam}
        </td>
        <td className="matchDateColumn">
          {moment(bet.matchDateTime).fromNow()}
        </td>
        <td className="matchResultColumn">
          {bet.matchHomeScore}:{bet.matchAwayScore}
          {bet.matchOvertime ? "P" : ""}
        </td>
        {(!canBetOnMatch || (canBetOnMatch && !isEditing)) && (
          <td className="matchBetColumn">
            {bet.homeScore}:{bet.awayScore}
            {bet.overtime ? "P" : ""}
          </td>
        )}
        {canBetOnMatch && isEditing && (
          <td className="matchBetColumn">
            <div>
              <input
                value={bet.homeScore}
                type="number"
                name="homeScore"
                min="0"
                style={{ width: "35px" }}
                onChange={(e) => {
                  const newBet = Object.assign({}, bet);
                  newBet.homeScore = e.target.value || 0;
                  setBet(newBet);
                }}
              />
              :
              <input
                value={bet.awayScore || 0}
                type="number"
                name="awayScore"
                min="0"
                style={{ width: "35px" }}
                onChange={(e) => {
                  const newBet = Object.assign({}, bet);
                  newBet.awayScore = e.target.value || 0;
                  setBet(newBet);
                }}
              />
              <input
                type="checkbox"
                title="Prodloužení"
                checked={bet.overtime}
                onChange={(e) => {
                  const newBet = Object.assign({}, bet);
                  newBet.overtime = e.target.checked;
                  setBet(newBet);
                }}
              />
            </div>
          </td>
        )}

        <td className="matchScorerColumn">
          {(!canBetOnMatch || (canBetOnMatch && !isEditing)) && (
            <span>{bet.scorer}</span>
          )}
          {canBetOnMatch && isEditing && (
            <Dropdown
              placeholder="Vyber střelce"
              fluid
              required
              selection
              search
              options={players}
              value={bet.scorerId}
              onChange={(e, { value }) => {
                const newBet = Object.assign({}, bet);
                newBet.scorerId = value;
                setBet(newBet);
                setIsEditing(true);
              }}
            />
          )}
        </td>
        <td className="matchPointsColumn">
          {!isEditing && <b>{bet.totalPoints}</b>}
          {isEditing && (
            <Button.Group>
              <Button
                disabled={isOriginalBet()}
                color="yellow"
                icon="check"
                onClick={() => handleBetChange()}
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
        {!canBetOnMatch && (
          <td className="matchIconColumn">{getArrowIcon(isToggledGame)}</td>
        )}
        {canBetOnMatch && !isEditing && (
          <td className="matchIconColumn">
            <Button
              inverted
              color="yellow"
              icon="pencil alternate"
              onClick={() => setIsEditing(true)}
              style={{ margin: 0 }}
            />
          </td>
        )}
        {canBetOnMatch && isEditing && <td className="matchIconColumn" />}
      </tr>
    </React.Fragment>
  );
}
