import axios from "axios";

let url = '/api/Usuarios';

export default {
  getAll: function () {
    return axios.get(`${url}/listar`);
  },
  post: function (usuario) {
    return axios.post(`${url}/Crear`, usuario);
  },
  put (usuario) {
    return axios.put(`${url}/actualizar`, usuario);
  },
  login: function (data) {
    return axios.post(`${url}/login`, data);
  }
}