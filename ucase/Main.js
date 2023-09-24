import axios from "axios";

export default () => {
  return axios.create({
    baseURL: "http://192.168.1.23:8009",
    responseType: 'json',
    withCredentials: true
  });
};