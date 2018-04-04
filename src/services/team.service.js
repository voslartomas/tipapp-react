import api from '../helpers/api'

export default class TeamService {
    static async getTeams(leagueId) {
        const response = await api.get(`api/leagues/${leagueId}/teams/`)
        console.log(leagueId)

        return response.body
    }
    static async getAllTeams() {
        const response = await api.get(`api/teams/`)

        return response.body
    }
    static async getTeamById(teamId) {
        const response = await api.get(`api/teams/${teamId}`)

        return response.body
    }
}