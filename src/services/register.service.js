import api from '../helpers/api'

export default class RegisterService {
  static async register(user) {
    const response = await api.post('api/register', user)

    return response.body
  }
}
