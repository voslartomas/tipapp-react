import request from 'superagent'

class Api {
   baseUrl = 'http://localhost:8080/'
   // baseUrl = 'http://localhost:7300/'
   // baseUrl = 'roman-talas-macbook-lan.60.31.10.in-addr.arpa'
  // baseUrl = 'https://tipapp-be.eu-gb.mybluemix.net/'

  constructor() {
    if (process.env.REACT_APP_ENV === 'production') {
        // this.baseUrl = 'https://tipapp-be.eu-gb.mybluemix.net/'
        // this.baseUrl = process.env.PRODUCTION_URL
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
