import request from 'superagent';

class NHLApi {
    baseURL = 'https://statsapi.web.nhl.com/api/v1/';

    async get(url) {
      return await request.get(this.baseUrl+url)
    }
}

export default new NHLApi()