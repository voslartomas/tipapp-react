import api from '../helpers/api';

export default class LeagueUserService {
  static async getUsers(leagueId) {
    const response = await api.get(`api/leagues/${leagueId}/users`);

    return response.body;
  }

  static async getUserById(leagueId, userId) {
    const response = await api.get(`api/leagues/${leagueId}/users/${userId}`);

    return response.body;
  }

  static async delete(leagueId, userId) {
    await api.delete(`api/leagues/${leagueId}/users/${userId}`);
  }

  static async create(leagueId, data) {
    await api.put(`api/leagues/${leagueId}/users/0`, data);
  }

  static async update(leagueId, data, id) {
    await api.put(`api/leagues/${leagueId}/users/${id}`, data);
  }
}
