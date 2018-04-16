import api from '../helpers/api'

export default class UserBetsSingleService {
  static async getAll(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}/user/bets/single`)

    return response.body
  }

  static async put(leagueId, data, id = 0) {
    return await api.put(`api/leagues/${leagueId}/user/bets/single/${id}`, data)
  }
}
