import api from '../helpers/api'

export default class UserBetsSerieService {
  static async getAll(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}/user/bets/series`)

    return response.body
  }

  static async put(leagueId, data, id = 0) {
    delete data.id
    return await api.put(`api/leagues/${leagueId}/user/bets/series/${id}`, data)
  }
}
