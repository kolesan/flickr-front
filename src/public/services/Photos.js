import axios from 'axios';
const config = require('../../../config');

import log from '../utils/Logging';

export const Sizes = {
  m: "m",
};

const { host, port } = config.server;
export default Object.freeze({
  getMultiple(count, page, size){
    return axios.get(`http://${host}:${port}/photos?count=${count}&page=${page}&size=${size}`);
  }
})