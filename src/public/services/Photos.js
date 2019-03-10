import axios from 'axios';
const config = require('../../../config');

import log from '../utils/Logging';

export const Sizes = {
  m: "m",
};

const { host, port } = config.server;
export default Object.freeze({
  getMultiple(page, size){
    return axios.get(`http://${host}:${port}/photos?page=${page}&size=${size}`);
  }
})