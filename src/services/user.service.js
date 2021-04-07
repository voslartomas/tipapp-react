import api from '../helpers/api';

export default class UserService {
  static async getUsers() {
    const response = await api.get('api/users');

    return response.body;
  }

  static async getUserById(userId) {
    const response = await api.get(`api/users/${userId}`);

    return response.body;
  }

  static async getCurrentUser() {
    const response = await api.get('api/users/current');

    return response.body;
  }

  static async changePassword(data) {
    await api.put('api/users/password', data);
  }

  static async delete(userId) {
    await api.delete(`api/users/${userId}`);
  }

  static async create(data) {
    await api.post('api/users', data);
  }

  static async update(data, id) {
    await api.put(`api/users/${id}`, data);
  }
}
