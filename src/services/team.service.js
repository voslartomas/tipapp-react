import api from '../helpers/api'

export default class TeamService {
  static async getTeams(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}/teams/`)

    return response.body
  }
  static async getAllTeams() {
    const response = await api.get('api/teams/')

    return response.body
  }
  static async getTeamById(teamId) {
    const response = await api.get(`api/teams/${teamId}`)

    return response.body
  }

  static async delete(teamId) {
    return await api.delete(`api/teams/${teamId}`)
  }

  static async create(data) {
    return await api.post('api/teams', data)
  }

  static async update(data, id) {
    return await api.put(`api/teams/${id}`, data)
  }
}
