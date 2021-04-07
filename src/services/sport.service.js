import api from '../helpers/api';

export default class SportService {
  static async getSports() {
    const response = await api.get('api/sports');

    return response.body;
  }

  static async getSportById(sportId) {
    const response = await api.get(`api/sports/${sportId}`);

    return response.body;
  }

  static async delete(sportId) {
    await api.delete(`api/sports/${sportId}`);
  }

  static async create(data) {
    await api.post('api/sports', data);
  }

  static async update(data, id) {
    await api.put(`api/sports/${id}`, data);
  }
}
