import api from '../helpers/api'

export default class LeagueService {
  static async getLeagues(sportId) {
    const response = await api.get(`api/sports/${sportId}/leagues/`)

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
}
