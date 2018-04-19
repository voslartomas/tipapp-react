import api from '../helpers/api'

export default class NHLService {
  static async importTeams() {
    const response = await api.get(`api/leagues/import/nhl/`)

    return response.body
  }
  static async importPlayers() {
    const response = await api.get(`api/leagues/import/nhl/players/`)

    return response.body
  }
}
