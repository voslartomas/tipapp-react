import api from '../helpers/api'

export default class PlayerService {
    static async getPlayers(leagueId) {
        const response = await api.get(`api/leagues/${leagueId}/players/`)

        return response.body
    }

    static async getPlayersByTeams(leagueId, teams) {
        console.log(teams)
        const response = await api.get(`api/leagues/${leagueId}/players/?teams=${teams.join(',')}`)

        return response.body
    }

    static async getAllPlayers() {
        const response = await api.get('api/players/')

        return response.body
      }
      static async getPlayerById(playerId) {
        const response = await api.get(`api/players/${playerId}`)

        return response.body
      }

      static async delete(playerId) {
        return await api.delete(`api/players/${playerId}`)
      }

      static async create(data) {
        return await api.post('api/players', data)
      }

      static async update(data, id) {
        return await api.put(`api/players/${id}`, data)
      }
}
