import api from '../helpers/api'

export default class LeagueService {
  static async getLeagues(sportId) {
    const response = await api.get(`api/sports/${sportId}/leagues/`)

    return response.body
  }

  static async getAllLeagues() {
    const response = await api.get('api/leagues/')

    return response.body
  }

  static async getLeagueById(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}`)

    return response.body
  }

  static async delete(leagueId) {
    return await api.delete(`api/leagues/${leagueId}`)
  }

  static async create(data) {
    return await api.post('api/leagues', data)
  }

  static async update(data, id) {
    return await api.put(`api/leagues/${id}`, data)
  }

  // Teams
  static async getTeams(leagueId: number) {
    const response = await api.get(`api/leagues/${leagueId}/teams`)

    return response.body
  }

  static async createTeam(leagueId, team) {
    return await api.post(`api/leagues/${leagueId}/teams`, team)
  }

  static async deleteTeam(leagueId, teamId) {
    return await api.delete(`api/leagues/${leagueId}/teams/${teamId}`)
  }

  // Players
  static async getPlayers(leagueId: number) {
    const response = await api.get(`api/leagues/${leagueId}/players`)

    return response.body
  }

  static async getPlayerById(leagueId: number, playerId: number) {
    const response = await api.get(`api/leagues/${leagueId}/players/${playerId}`)

    return response.body
  }

  static async createPlayer(leagueId, player) {
    return await api.post(`api/leagues/${leagueId}/players`, player)
  }

  static async deletePlayer(leagueId, playerId) {
    return await api.delete(`api/leagues/${leagueId}/players/${playerId}`)
  }
}
