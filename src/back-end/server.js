const express = require('express');
const axios = require('axios');
const config = require('../../config');

console.log(config);
const app = express();
let { port } = config.server;
console.log(port);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// app.use(express.static("dist"));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

let photoSaveForCSsWOrk = null;
recentPhotosData(100)
  .then(function (response) {
    // console.log(response);
    const photos = response.data.photos.photo;
    photoSaveForCSsWOrk = photos.filter(hasShortTitle).map(toPhotoResponseObject);
  })
  .catch(function (error) {
    console.log("ERROR:");
    console.log(error);
  });

function hasShortTitle(flickrPhotoData) {
  return flickrPhotoData.title.length <= 30;
}

function toPhotoResponseObject(flickrPhotoData) {
  return {
    url: flickrPhotoData.url_m,
    title: flickrPhotoData.title
  }
}

app.get('/photos', (req, res) => {
  const count = req.query.count;

  res.send(photoSaveForCSsWOrk.slice(0, count));
  // recentPhotosData(count)
  //   .then(function (response) {
  //     console.log("RESPONSE:");
  //     console.log(response);
  //     const photos = response.data.photos.photo;
  //     res.send(photos.map(photo => photo.url_m));
  //     res.send(photoSaveForCSsWOrk);
  //   })
  //   .catch(function (error) {
  //     console.log("ERROR:");
  //     // handle error
  //     console.log(error);
  //   })
  //   .then(function () {
  //     // always executed
  //   })
});

function recentPhotosData(count) {
  return axios.get(noSpaces(`https://api.flickr.com/services/rest/?
    method=flickr.photos.search&
    api_key=1988ffb00086eca7595a0e8ad80025fc&
    safe_search=1&
    content_type=1&
    tags=nature%2Cscience%2Cfood%2Ccat%2Ccar&
    is_getty=true&
    extras=url_m%2Curl_o&
    per_page=${count}&
    page=0&
    format=json&
    nojsoncallback=1
  `));
}

app.get('/photos/{id}', (req, res) => {
  let id = req.param('id');
  // let size = req.getQuery();
  validate(id);

  axios.get(`https://farm6.staticflickr.com/5509/${id}_aff70630a261a66a.jpg`)
    .then(function (response) {
      res.send(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    })
});

function noSpaces(s) {
  if (typeof s !== "string") {
    return;
  }
  return s.replace(/\s/g, "");
}

function validate(id) {
  if (!id && id !== 0) {
    throw ValidationError(`Invalid photo id '${id}'`);
  }
}

class ValidationError extends Error {
  constructor(msg) {
    super(msg)
  }
}