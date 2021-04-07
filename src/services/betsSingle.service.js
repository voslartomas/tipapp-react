import api from '../helpers/api';

export default class BetsSingleService {
  static async getAll(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}/bets/single`);

    return response.body;
  }

  static async getById(leagueId, betId) {
    const response = await api.get(`api/leagues/${leagueId}/bets/single/${betId}`);

    return response.body;
  }

  static async delete(leagueId, betId) {
    await api.delete(`api/leagues/${leagueId}/bets/single/${betId}`);
  }

  static async create(leagueId, data) {
    await api.put(`api/leagues/${leagueId}/bets/single/0`, data);
  }

  static async update(leagueId, data, id) {
    await api.put(`api/leagues/${leagueId}/bets/single/${id}`, data);
  }
}
