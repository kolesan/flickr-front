import log from '../utils/Logging';
import { noop } from '../utils/Utils';

const config = CONFIG;
const { host, port } = config.server;
const { messageTypes } = config;

log("Configuration: ", config);
export default function inst() {
  let socket = new WebSocket(`wss://flickr-test-app.herokuapp.com`);
  socket.addEventListener('open', () => {
    log("Connection opened");
    onOpenCb();
  });
  socket.addEventListener('close', () => {
    log("Connection closed, trying to open a new one");
    socket = new WebSocket(`wss://flickr-test-app.herokuapp.com`);
  });
  socket.addEventListener('message', event => {
    let message = decode(event.data);
    console.log('\nReceived message: ', message);
    if (message.type === messageTypes.PHOTOS) {
      onMessageCb(message.photos);
    } else if (message.type === messageTypes.END) {
      onEndCb();
    }
  });

  let onOpenCb = noop;
  let onMessageCb = noop;
  let onEndCb = noop;

  return Object.freeze({
    request(count, tags){
      send({
        type: messageTypes.GIVE,
        count: count,
        tags
      });
    },
    onOpen(cb) {
      onOpenCb = cb;
      return this;
    },
    onReceived(cb) {
      onMessageCb = cb;
      return this;
    },
    onEnd(cb) {
      onEndCb = cb;
      return this;
    }
  });

  function send(o) {
    socket.send(encode(o));
  }
}

function decode(msg) {
  return JSON.parse(msg);
}
function encode(o) {
  return JSON.stringify(o);
}