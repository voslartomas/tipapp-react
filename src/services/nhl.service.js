import api from '../helpers/nhlApi.js'

export default class NHLService {
  static async getAllTeams() {
    const response = await api.get('teams/')

    return response.body
  }
}