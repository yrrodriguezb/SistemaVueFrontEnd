import axios from 'axios'

let url = '/api/ingresos'

export default {
  get: function () {   
    return axios.get(`${url}/listar`);
  },
  getDetailById: function (idingreso) {
    return axios.get(`${url}/listardetalles/${idingreso}`);
  },
  post: function (ingreso) {
    return axios.post(`${url}/crear`, ingreso);
  },
  put (ingreso) {
    return axios.put(`${url}/actualizar`, ingreso);
  },
  putEstado (id) {
    return axios.put(`${url}/activar/${id}`);
  },
  putAnular (id) {
    return axios.put(`${url}/Anular/${id}`);
  }
}