import request from 'superagent'

class Api {
  baseUrl = 'http://52.58.100.173:8001/'

  constructor() {
    if (process.env.REACT_APP_ENV === 'production') {
        this.baseUrl = 'http://52.58.100.173:8001/'
    }
  }

  async get(url) {
    return await request.get(this.baseUrl+url)
      .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
  }

  async delete(url) {
    return await request.delete(this.baseUrl+url)
      .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
  }

  async post(url, data) {
    return await request.post(this.baseUrl+url).send(data)
      .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
  }

  async put(url, data) {
    return await request.put(this.baseUrl+url).send(data)
      .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
  }
}

export default new Api()
