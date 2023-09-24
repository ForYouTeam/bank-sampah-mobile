import Main from "./Main"
const endPoint = '/api/vmob/metode'

import Config from "./Config"

export default {
  async getAllData() {
    let result
    await Config.token()
    .then((res) => {
      result = res
    })
    return Main().get(endPoint, {
      headers: {
        Authorization: `Bearer ${result}`,
      }
    })
  }
}