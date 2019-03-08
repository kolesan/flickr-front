import axios from 'axios';
const config = require('../../../config');

import log from '../utils/Logging';

export const Sizes = {
  m: "m",
};

const { host, port } = config.server;
export default Object.freeze({
  getMultiple(count, size){
    return axios.get(`http://${host}:${port}/photos?count=${count}&size=${size}`);
  }
})