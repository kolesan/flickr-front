# flickr-front
Test flickr app

### Installing
Use `npm install` to get all the node modules needed for this project to work

### Running
Use `npm start` (only for Windows OS) to start development processes 
in new CMDs: back end node module under nodemon, 
front end under webpack-dev-server, jest in watch mode. 
(You will have to change IP adress in the config.dev.js to yours 
and probably forward the port from the config)

Use `npm run startProd` to build production bundle and then 
start express.js server on localhost:3000 
(can be changed in config.prod.js). The server
will serve the bundle as a static file. It will also act as a
back end server for web socket connections.

### Tests
Use `npm run test` to run the Jest test suite
