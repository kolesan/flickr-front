const { config } = require('./config_loader');
const { GIVE, PHOTOS, END } = config.messageTypes;

function newPhotoProviderConnectionDecorator(connection) {

  return Object.freeze({
    decorateWith(photoProvider) {
      photoProvider.onPhotosFound(handlePhotoSearchResponse);

      connection.on('message', message => {
        console.log('\nReceived message: ', message);
        let request = decode(message);
        if (request.type === GIVE) {
          console.log(`Client requested [${request.count}] photos of '${request.tags}'`);
          photoProvider.setTags(request.tags);
          photoProvider.requestPhotos(request.count);
        }
      });

      function handlePhotoSearchResponse(photos) {
        if (photos.length) {
          sendPhotosToClient(photos)
        } else {
          photoProvider.stop();
          sendEndMessageToClient()
        }
      }
    }
  });

  function sendPhotosToClient(photos) {
    console.log(`Sending [${photos.length}] photos to the client`);
    send({
      type: PHOTOS,
      photos
    });
  }

  function sendEndMessageToClient() {
    console.log(`Sending END message to the client\n`);
    send({
      type: END
    });
  }

  function send(msg) {
    connection.send(encode(msg), errorCallback);
  }
}

function errorCallback(error) {
  if (error) {
    console.log('Error sending photos to the client: ', error);
  }
}

function encode(o) {
  return JSON.stringify(o)
}
function decode(msg) {
  return JSON.parse(msg)
}

module.exports = {
  newPhotoProviderConnectionDecorator
};