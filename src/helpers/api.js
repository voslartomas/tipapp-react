import request from 'superagent'

class Api {
  baseUrl = 'http://localhost:7300/'

  async post(url, data) {
    try {
      return await request.post(this.baseUrl+url)
        .set('Content-Type', 'application/json')
        .send(data)
    } catch (e) {
      console.log(e)
      return undefined
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
