import api from '../helpers/api'

export default class NHLService {
  static async importTeams(leagueId) {
    const response = await api.get(`api/leagues/import/nhl/${leagueId}/teams`)

    return response.body
  }
  static async importPlayers() {
    const response = await api.get(`api/leagues/import/nhl/players/`)

    return response.body
  }
}
