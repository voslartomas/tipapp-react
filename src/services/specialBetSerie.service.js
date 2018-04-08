import api from '../helpers/api'

export default class SpecialBetSerieService {
  static async getAll() {
    const response = await api.get('api/bets/series')

    return response.body
  }
}
