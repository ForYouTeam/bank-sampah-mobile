import axios from "axios";

export default () => {
  return axios.create({
    baseURL: "http://192.168.1.21:8009/api",
    responseType: 'json',
    withCredentials: true
  });
};