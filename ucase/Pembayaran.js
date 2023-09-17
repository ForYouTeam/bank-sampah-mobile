import Main from "./Main"
const endPoint = '/vmob/pembayaran'

import Config from "./Config"

export default {
  getAllData() {
    return Main().get(endPoint, Config.getToken())
  }
}