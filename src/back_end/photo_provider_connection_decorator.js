const { config } = require('./config_loader');
const { messageTypes } = config;

function newPhotoProviderConnectionDecorator(connection) {

  return Object.freeze({
    decorateWith(photoProvider) {
      photoProvider.onPhotosFound(sendBackPhotos);

      connection.on('message', message => {
        console.log('\nReceived message: ', message);
        let request = decode(message);
        if (request.type === messageTypes.GIVE) {
          console.log(`Client requested [${request.count}] photos of '${request.tags}'`);
          photoProvider.setTags(request.tags);
          photoProvider.requestPhotos(request.count);
        }
      });
    }
  });

  function sendBackPhotos(photos) {
    console.log(`Sending [${photos.length}] photos to the client`);
    let msg = encode({photos, type: messageTypes.PHOTOS});
    connection.send(msg, err => {
      if (err) {
        console.log('Error sending photos to the client: ', err);
      }
    });
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