import axios from 'axios';

import log from '../utils/Logging';

export const Sizes = {
  m: "m",
};

export default Object.freeze({
  getMultiple(count, size){
    return axios.get(`http://localhost:3000/photos?count=${count}&size=${size}`);
  }
})