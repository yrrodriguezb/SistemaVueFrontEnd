import axios from "axios";

let url = '/api/roles';

export default {
  getAll: function () {
    return axios.get(`${url}/listar`);
  },
  getList:function () {
    return axios.get(`${url}/Select`);
  }
}