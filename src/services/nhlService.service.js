import api from '../helpers/api';

export default class NHLService {
  static async import(leagueId) {
    const response = await api.get(`api/leagues/import/nhl/${leagueId}/`);

    return response.body;
  }

  static async updateMatches(leagueId) {
    const response = await api.get(`api/leagues/import/nhl/${leagueId}/matches`);

    return response.body;
  }
}
