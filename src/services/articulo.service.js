import axios from "axios";

let url = '/api/Articulos'

export default {
  getAll: function () {
    return axios.get(`${url}/Listar`);
  },
  getByCodeEntry: function (codigo) {
    return axios.get(`${url}/buscarcodigoingreso/${codigo}`);
  },
  getByCodeSale: function (codigo) {
    return axios.get(`${url}/buscarcodigoventa/${codigo}`);
  },
  getLike: function (texto) {
    return axios.get(`${url}/listararticulos/${texto}`);
  },
  getLikeSale: function (texto) {
    return axios.get(`${url}/listarventas/${texto}`);
  },
  post: function (articulo) {
    return axios.post(`${url}/Crear`, articulo);
  },
  put (articulo) {
    return axios.put(`${url}/Actualizar`, articulo);
  },
  putEstado (id) {
    return axios.put(`${url}/activar/${id}`);
  }
}