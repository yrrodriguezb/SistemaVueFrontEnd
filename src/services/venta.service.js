import axios from 'axios'

let url = '/api/ventas'

export default {
  get: function () {   
    return axios.get(`${url}/listar`);
  },
  getDate: function (inicial, final) {
    return axios.get(`${url}/ConsultaPorFechas/${inicial}/${final}`);
  },
  getDetailById: function (idingreso) {
    return axios.get(`${url}/listardetalles/${idingreso}`);
  },
  getSalesLast12Month: function () {
    return axios.get(`${url}/VentasUltimosDoceMeses`);
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