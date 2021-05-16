import React, { useState, useEffect } from "react";
import { getArrowIcon, loadingComponent } from "../../../helpers/utils";
import moment from "moment";
import { Button, Form, Dropdown } from "semantic-ui-react";
import UserBetsSingleService from "../../../services/userBetsSingle.service";

export default function SpecialBetRow({
  betProp,
  canBetOnSpecial,
  reload,
  isToggledBet,
  onClickHandler,
  leagueId,
  playersOptions,
  teamsOptions,
}) {
  const [bet, setBet] = useState(betProp);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isOriginalBet = () => {
    return (
      bet.teamResultId == betProp.teamResultId &&
      bet.playerResultId == betProp.playerResultId &&
      bet.valueBet == betProp.valueBet
    );
  };

  useEffect(() => setBet(betProp), [betProp]);

  const getResult = () => {
    if (bet.valueBet) {
      return bet.valueBet;
    } else if (bet.playerBet) {
      return `${bet.playerBet}`;
    } else if (bet.teamBet) {
      return bet.teamBet;
    }
  };

  const submitBet = async () => {
    setIsLoading(true);
    const data = {
      leagueSpecialBetSingleId: bet.singleId,
    };
    if (bet.type === 1) {
      data["playerResultId"] = bet.playerBet;
    } else if (bet.type === 2) {
      data["teamResultId"] = bet.teamBet;
    } else if (bet.type === 3) {
      data["value"] = bet.valueBet;
    }

    await UserBetsSingleService.put(leagueId, data, bet.id || 0);
    setIsLoading(false);
    setIsEditing(false);
    reload();
  };

  return (
    <React.Fragment>
      {loadingComponent(isLoading)}
      <tr onClick={() => !canBetOnSpecial && onClickHandler(bet)}>
        <td className="specialNameColumn">{bet.name}</td>
        <td className="specialDateColumn">
          <span>Konec {moment(bet.endDate).fromNow()}</span>
        </td>
        <td className="specialResultColumn">
          {bet.team && bet.team}
          {bet.player && bet.player}
          {(bet.value && bet.value) || ''}
        </td>
        {(!canBetOnSpecial || (canBetOnSpecial && !isEditing)) &&
          <td className="specialBetColumn">
            {getResult()}
          </td>
        }
        {canBetOnSpecial && isEditing && (
          <td className="specialBetColumn">
            {bet.type === 1 && (
              <Dropdown
                placeholder="Vyber hráče"
                fluid
                required
                selection
                search
                options={playersOptions}
                value={bet.playerResultId}
                onChange={(e, { value }) => {
                  const newBet = Object.assign({}, bet);
                  newBet.playerBet = value;
                  newBet.playerResultId = value;
                  setBet(newBet);
                  setIsEditing(true);
                }}
              />
            )}

            {bet.type === 2 && isEditing && (
              <Dropdown
                placeholder="Vyber tým"
                fluid
                required
                selection
                search
                options={teamsOptions}
                value={bet.teamResultId}
                onChange={(e, { value }) => {
                  const newBet = Object.assign({}, bet);
                  newBet.teamBet = value;
                  newBet.teamResultId = value;
                  setBet(newBet);
                  setIsEditing(true);
                }}
              />
            )}

            {bet.type === 3 && isEditing && (
              <span>
                <input
                  placeholder="Napiš hodnotu"
                  value={bet.valueBet || ""}
                  onChange={(e) => {
                    const newBet = Object.assign({}, bet);
                    newBet.valueBet = e.target.value || 0;
                    setBet(newBet);
                  }}
                  type="text"
                />
              </span>
            )}
          </td>
        )}
        <td className="specialPointsColumn">
          {!isEditing && <b>{bet.totalPoints}</b>}
          {isEditing && (
            <Button.Group>
              <Button
                disabled={isOriginalBet()}
                color="yellow"
                icon="check"
                onClick={() => submitBet()}
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
        {!canBetOnSpecial && <td className="specialIconColumn">{getArrowIcon(isToggledBet)}</td>}
        {canBetOnSpecial && !isEditing && (
          <td className="specialIconColumn">
            <Button
              inverted
              color="yellow"
              icon="pencil alternate"
              onClick={() => setIsEditing(true)}
            />
          </td>
        )}
        {canBetOnSpecial && isEditing && <td className="specialIconColumn" />}
      </tr>
    </React.Fragment>
  );
}
