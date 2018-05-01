import api from '../helpers/api'

export default class EvaluatorService {
  static async getAll(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}/evaluators/`)

    return response.body
  }

  static async get(leagueId, evaluatorId) {
    const response = await api.get(`api/leagues/${leagueId}/evaluators/${evaluatorId}`)

    return response.body
  }

  static async getTypes(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}/evaluators/types`)

    return response.body
  }

  static async delete(leagueId, evaluatorId) {
    return await api.delete(`api/leagues/${leagueId}/evaluators/${evaluatorId}`)
  }

  static async create(leagueId, data) {
    return await api.post(`api/leagues/${leagueId}/evaluators`, data)
  }

  static async update(leagueId, data, id) {
    return await api.put(`api/leagues/${leagueId}/evaluators/${id}`, data)
  }
}
