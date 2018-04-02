import api from '../helpers/api'

export default class PlayerService {
    static async getPlayers(leagueId) {
        const response = await api.get(`api/leagues/${leagueId}/players/`)
        console.log(leagueId)

        return response.body
    }
}