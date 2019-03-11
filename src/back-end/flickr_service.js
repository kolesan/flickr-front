const axios = require('axios');
const { noSpaces } = require('./utils.js');

function searchPhotos(count = 20, page = 0) {
  return axios.get(noSpaces(`https://api.flickr.com/services/rest/?
    method=flickr.photos.search&
    api_key=00ac5f70d662304b87e7da585bbdef9d&
    safe_search=1&
    content_type=1&
    tags=nature,science,food,cat,car&
    is_getty=true&
    extras=url_m%2Curl_o&
    per_page=${count}&
    page=${page}&
    format=json&
    nojsoncallback=1
  `));
}

module.exports = {
  searchPhotos
};