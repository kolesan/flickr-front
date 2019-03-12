const path = require('path');
const express = require('express');
const WebSocket = require('ws');
const { searchPhotos } = require('./flickr_service');
const { config } = require('./config_loader');
const { port } = config.server;
const { messageTypes, bundleDir } = config;

console.log("Configuration: ", config);

let app = express();
let server = app.listen(process.env.PORT || port, () => console.log(`Express server listening on port ${port}!`));
const wss = new WebSocket.Server({ server });

if (config.production) {
  console.log("Serving static content from: ", bundleDir);
  app.use(express.static(bundleDir));
  app.use((req, res) => res.sendFile(`${path.resolve(bundleDir)}/index.html`));
}

wss.on('connection', function connection(ws) {
  console.log('Connection established');
  let page = 0;
  let photoSaveForCSsWOrk = [];

  searchPhotos(20, page++)
    .then(function (response) {
      const photos = response.data.photos.photo;
      photoSaveForCSsWOrk.push(...photos.filter(hasShortTitle).map(toPhotoResponseObject));

      sendBackPhotos(10, page);
    })
    .catch(function (error) {
      console.log("ERROR:");
      console.log(error);
    });

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    let request = fromMessage(message);
    if (request.type === messageTypes.GIVE) {
      //start sendin photos
      let count = request.count;
      sendBackPhotos(10, message.page);
    }
  });

  function sendBackPhotos(count, page = 0) {
    let startIndex = page * count;
    let endIndex = startIndex + count;
    // if (endIndex > photoSaveForCSsWOrk.length - 50) {
    //   loadSomeTestPhotos();
    // }
    console.log('Sending some photos');
    console.log({count, page, startIndex, endIndex, all: photoSaveForCSsWOrk.length});

    let msg = toMessage(photoSaveForCSsWOrk.slice(startIndex, endIndex));

    ws.send(msg, err => {
      console.log('Oh no. ', err);
    });
  }
});
function toMessage(o) {
  return JSON.stringify(o)
}
function fromMessage(msg) {
  return JSON.parse(msg)
}

function hasShortTitle(flickrPhotoData) {
  let titleLength = flickrPhotoData.title.length;
  return titleLength > 0 && titleLength <= 30;
}

function toPhotoResponseObject(flickrPhotoData) {
  return {
    url: flickrPhotoData.url_m,
    title: flickrPhotoData.title
  }
}