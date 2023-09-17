import Main from "./Main"
const endPoint = '/vmob/profile'

import Config from "./Config"

export default {
  getAllData() {
    return Main().get(endPoint, Config.getToken())
  }
}