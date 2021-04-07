import request from 'superagent';

class Api {
  constructor() {
    const isProd = process.env.REACT_APP_ENV === 'production';
    this.baseUrl = isProd ? 'http://54.93.116.88:8001/' : 'http://localhost:7300/';
  }

  async get(url) {
    await request.get(this.baseUrl + url).set('Authorization', `Bearer ${localStorage.getItem('token')}`);
  }

  async delete(url) {
    await request.delete(this.baseUrl + url).set('Authorization', `Bearer ${localStorage.getItem('token')}`);
  }

  async post(url, data) {
    await request
      .post(this.baseUrl + url)
      .send(data)
      .set('Authorization', `Bearer ${localStorage.getItem('token')}`);
  }

  async put(url, data) {
    await request
      .put(this.baseUrl + url)
      .send(data)
      .set('Authorization', localStorage ? `Bearer ${localStorage.getItem('token')}` : null);
  }
}

export default new Api();
