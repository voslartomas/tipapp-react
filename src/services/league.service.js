import api from '../helpers/api'

export default class LeagueService {
  static async getLeagues(sportId) {
    const response = await api.get(`api/sports/${sportId}/leagues/`)

    return response.body
  }

  static async getActiveLeagues() {
    const response = await api.get(`api/leagues/active`)

    return response.body
  }

  static async getAllLeagues() {
    const response = await api.get('api/leagues/')

    return response.body
  }

  static async getLeaderBoard(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}/leaderboard`)

    return response.body
  }

  static async getBetsMatches(leagueId, date = '2018-04-29') {
    const response = await api.get(`api/leagues/${leagueId}/bets/matches?date=${date}`)

    return response.body
  }

  static async getLeagueById(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}`)

    return response.body
  }

  static async delete(leagueId) {
    return api.delete(`api/leagues/${leagueId}`)
  }

  static async create(data) {
    return api.post('api/leagues', data)
  }

  static async update(data, id) {
    return api.put(`api/leagues/${id}`, data)
  }

  // Teams
  static async getTeams(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}/teams`)

    return response.body
  }

  static async createTeam(leagueId, team) {
    return api.post(`api/leagues/${leagueId}/teams`, team)
  }

  static async deleteTeam(leagueId, teamId) {
    return api.delete(`api/leagues/${leagueId}/teams/${teamId}`)
  }

  // Players
  static async getPlayers(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}/players`)

    return response.body
  }

  static async getPlayerById(leagueId, playerId) {
    const response = await api.get(`api/leagues/${leagueId}/players/${playerId}`)

    return response.body
  }

  static async createPlayer(leagueId, player) {
    return api.post(`api/leagues/${leagueId}/players`, player)
  }

  static async deletePlayer(leagueId, playerId) {
    return api.delete(`api/leagues/${leagueId}/players/${playerId}`)
  }
}
