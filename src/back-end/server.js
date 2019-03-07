const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// app.use(express.static("dist"));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/photos', (req, res) => {
  const count = req.query.count;

  recentPhotosData(count)
    .then(function (response) {
      // console.log("RESPONSE:");
      console.log(response);
      // res.send(response.data);
      const photos = response.data.photos.photo;
      res.send(photos.map(photo => photo.url_m));
    })
    .catch(function (error) {
      console.log("ERROR:");
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    })
});

function recentPhotosData(count) {
  return axios.get(noSpaces(`https://api.flickr.com/services/rest/?
    method=flickr.photos.getRecent&
    api_key=00ac5f70d662304b87e7da585bbdef9d&
    extras=url_m%2Curl_o&
    per_page=${count}&
    page=0&
    format=json&
    nojsoncallback=1
  `));
}

function onePhoto(photoData) {
  let url = photoData.url_m;
  axios.get(`https://farm6.staticflickr.com/5509/${id}_aff70630a261a66a.jpg`)
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));