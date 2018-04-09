import api from '../helpers/api'

export default class SpecialBetSingleService {
  static async getAll() {
    const response = await api.get('api/bets/single')

    return response.body
  }
}
