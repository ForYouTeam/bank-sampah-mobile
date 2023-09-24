import Main from "./Main"
const endPoint = '/oauth/token'

import Config from "./Config"

const secretToken = 'pweKp26yhwhqeMa0c39Klkuik4Cr1sih0dipfGLQ'

export default {
  login(payload) {
    return Main().post(endPoint, {
      grant_type: 'password',
      client_id : 1,
      client_secret : secretToken,
      username : payload.username,
      password : payload.password,
      scope : ""
    })
  },

  async logout() {
    let result
    await Config.token()
    .then((res) => {
      result = res
    })
    return Main().get('/api/vmob/logout', {
      headers: {
        Authorization: `Bearer ${result}`,
      }
    })
  }
}