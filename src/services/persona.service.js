import axios from "axios";

let url = '/api/Personas';

export default {
  getClientes: function () {
    return axios.get(`${url}/listar/cliente`);
  },
  getProveedores: function () {
    return axios.get(`${url}/listar/proveedor`);
  },
  post: function (persona) {
    return axios.post(`${url}/Crear`, persona);
  },
  put (persona) {
    return axios.put(`${url}/actualizar`, persona);
  },
  selectCliente: function () {
    return axios.get(`${url}/listarselect/cliente`);
  },
  selectProveedor: function () {
    return axios.get(`${url}/listarselect/proveedor`);
  }
}