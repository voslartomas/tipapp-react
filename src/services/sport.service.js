import api from '../helpers/api'

export default class SportService {
  static async getSports() {
    const response = await api.get('api/sports')

    return response.body
  }
}
