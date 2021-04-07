import api from '../helpers/api';

export default class BetsSerieService {
  static async getAll(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}/bets/series`);

    return response.body;
  }

  static async getById(leagueId, betId) {
    const response = await api.get(`api/leagues/${leagueId}/bets/series/${betId}`);

    return response.body;
  }

  static async delete(leagueId, betId) {
    await api.delete(`api/leagues/${leagueId}/bets/series/${betId}`);
  }

  static async create(leagueId, data) {
    await api.put(`api/leagues/${leagueId}/bets/series/0`, data);
  }

  static async update(leagueId, data, id) {
    await api.put(`api/leagues/${leagueId}/bets/series/${id}`, data);
  }
}
