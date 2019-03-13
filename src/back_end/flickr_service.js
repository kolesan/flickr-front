const axios = require('axios');
const { noSpaces } = require('./utils.js');

function newFlickrSearchService() {
  return Object.freeze({
    search(count, page, tags) {
      return searchFlickr(count, page, tags)
        .then(response => {
          let flickrPhotos = response.data.photos.photo;
          console.log(`Flickr returned data on [${flickrPhotos.length}] photos`);
          return flickrPhotos.map(toPhotoObject);
        })
        .catch(function (error) {
          console.log("ERROR during request to flickr services: ");
          console.log(error);
        });
    }
  })
}

function searchFlickr(count = 20, page = 0, tags) {
  console.log(`Searching flickr. Params: count=${count}, page=${page}, tags=${tags}`);
  return axios.get(noSpaces(`https://api.flickr.com/services/rest/?
    method=flickr.photos.search&
    api_key=00ac5f70d662304b87e7da585bbdef9d&
    safe_search=1&
    content_type=1&
    tags=${tags}&
    is_getty=true&
    extras=url_m&
    per_page=${count}&
    page=${page}&
    format=json&
    nojsoncallback=1
  `))
}

function toPhotoObject(flickrPhotoData) {
  return {
    url: flickrPhotoData.url_m,
    title: flickrPhotoData.title
  }
}

module.exports = {
  newFlickrSearchService
};