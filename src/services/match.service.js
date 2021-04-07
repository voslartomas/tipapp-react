import api from '../helpers/api';

export default class MatchService {
  static async getMatches(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}/matches/`);

    return response.body;
  }

  static async getMatchById(matchId) {
    const response = await api.get(`api/matches/${matchId}`);

    return response.body;
  }

  static async getMatchScorersById(matchId) {
    const response = await api.get(`api/matches/${matchId}/scorers`);

    return response.body;
  }

  static async delete(matchId) {
    await api.delete(`api/matches/${matchId}`);
  }

  static async create(data) {
    await api.post('api/matches', data);
  }

  static async update(data, id) {
    await api.put(`api/matches/${id}`, data);
  }
}
