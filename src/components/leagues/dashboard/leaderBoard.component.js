import React, { useState, useEffect } from 'react'
import LeagueService from '../../../services/league.service'
import { loadingComponent } from '../../../helpers/utils'

export default function LeaderBoardComponent(props) {
  const [players, setPlayers] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const loadPlayers = async () => {
    setIsLoading(true);
    const plr = await LeagueService.getLeaderBoard(props.leagueId)

    const pl = plr.map((p, i) => {
      if (i === 0 || (plr[i - 1].totalPoints !== p.totalPoints)) {
        p.position = i + 1
      } else {
        p.position = ''
      }
      return p
    });
    setPlayers(pl)
    setIsLoading(false)
  }

  useEffect(() => loadPlayers(), [])

  const getBackgroundColor = (position) => {
    switch (position) {
      case 1:
        return 'gold'
      case 2:
        return 'silver'
      case 3:
        return '#CD7F32'
      default:
        return ''
    }
  }

  const getTextColor = (position) => {
    if (position < 3) {
      return '#202020'
    }
    return 'white'
  }

  return (
    <div className="page">
      {loadingComponent(isLoading)}
      <table>
        <tbody>
          <tr>
            <th width="5%">#</th>
            <th width="65%">Jméno</th>
            <th width="30%">Body</th>
          </tr>
          {players.map((player, i) => (
            <tr key={`${player.firstName}_${player.lastName}_${player.totalPoints}`}>
              <td
                align="left"
                style={{
                  background: getBackgroundColor(i + 1),
                  color: getTextColor(i + 1),
                  textAlign: 'center',
                }}
              >
                {player.position && `${player.position}.`}
              </td>
              <td align="left" style={{ textAlign: 'center' }}>
                {player.firstName} {player.lastName}
              </td>
              <td>
                <b>{player.totalPoints}</b>
              </td>
            </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
