const path = require('path');
const express = require('express');
const WebSocket = require('ws');
const { toPositiveInt } = require("./utils");
const { searchPhotos } = require('./flickr_service');
const { config } = require('./config_loader');
const { port } = config.server;
const { messageTypes, bundleDir } = config;

console.log("Configuration: ", config);

let app = express();
let server = app.listen(port, () => console.log(`Express server listening on port ${port}!`));
const wss = new WebSocket.Server({ server });

if (config.production) {
  console.log("Serving static content from: ", bundleDir);
  app.use(express.static(bundleDir));
  app.use((req, res) => res.sendFile(`${path.resolve(bundleDir)}/index.html`));
}


wss.on('connection', function connection(ws) {
  console.log('Connection established');
  let page = 1;
  let requestedPhotoCount = 0;
  let tags = defaultTags();

  ws.on('message', function incoming(message) {
    console.log('Received message: ', message);
    let request = fromMessage(message);
    if (request.type === messageTypes.GIVE) {
      let count = toPositiveInt(request.count);
      let newTags = defaultTags(request.tags);
      if (newTags !== tags) {
        tags = newTags;
        page = 1;
      }

      requestedPhotoCount += count;
      console.log(`Client requested ${requestedPhotoCount} photos`);

      requestPhotos(tags);
    }
  });

  function requestPhotos(tags) {
    return searchPhotos({page: page++, tags})
      .then(function (response) {
        const photos = response.data.photos.photo;
        return photos.filter(hasShortTitle).map(toPhotoResponseObject);
      })
      .then(photos => {
        sendBackPhotos(photos);
        requestedPhotoCount = Math.max(0, requestedPhotoCount - photos.length);
        console.log(`Need to send ${requestedPhotoCount} more photos`);
        if (requestedPhotoCount > 0) {
          requestPhotos(tags);
        }
      })
      .catch(function (error) {
        console.log("ERROR:");
        console.log(error);
      });
  }

  function sendBackPhotos(photos) {
    console.log(`Sending ${photos.length} photos to the client`);

    let msg = toMessage({photos, type: messageTypes.PICTURES});

    ws.send(msg, err => {
      if (err) {
        console.log('Oh no. ', err);
      }
    });
  }
});

function defaultTags(tags) {
  if (tags === null || tags === undefined || tags === "") {
    return "nature,science,food,cat,car";
  }
  return tags;
}

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