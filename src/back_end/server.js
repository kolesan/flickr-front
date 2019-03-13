const path = require('path');
const express = require('express');
const WebSocket = require('ws');
const { newPhotoProviderConnectionDecorator } = require('./photo_provider_connection_decorator');
const { newPhotoProvider } = require('./photo_provider');
const { newFlickrSearchService } = require('./flickr_service');
const { config } = require('./config_loader');
const port = process.env.PORT || config.server.port;
const { bundleDir } = config;

console.log("Configuration: ", config);

let app = express();
let server = app.listen(port, () => console.log(`Express server listening on port ${port}!`));

if (config.production) {
  console.log("Serving static content from: ", bundleDir);
  app.use(express.static(bundleDir));
  app.use((req, res) => res.sendFile(`${path.resolve(bundleDir)}/index.html`));
}

console.log("Enabling web sockets");
const wss = new WebSocket.Server({ server });
wss.on('connection', ws => {
  console.log('Connection established. Decorating with photo provider functionality.');
  let flickr = newFlickrSearchService();
  let photoProvider = newPhotoProvider(flickr);
  let decorator = newPhotoProviderConnectionDecorator(ws);
  decorator.decorateWith(photoProvider);
});