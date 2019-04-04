import axios from 'axios'

let url = '/api/Categorias'

export default {
  get: function () {
    return axios.get(`${url}/Categorias`);
  },
  getAll: function () {   
    return axios.get(`${url}/Listar`);
  },
  post: function (categoria) {
    return axios.post(`${url}/crear`, categoria);
  },
  put (categoria) {
    return axios.put(`${url}/Actualizar`, categoria);
  },
  putEstado (id) {
    return axios.put(`${url}/activar/${id}`);
  }
}
