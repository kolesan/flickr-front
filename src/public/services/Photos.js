import log from '../utils/Logging';
import { noop } from '../utils/Utils';

const config = require('../../../config');
const { host, port } = config.server;
const { messageTypes } = config;

export default function inst() {
  let socket = new WebSocket(`ws://${host}:${port}`);
  socket.addEventListener('open', () => {
    log("Connection opened");
    onOpenCb();
  });
  socket.addEventListener('close', () => {
    log("Connection closed, trying to open a new one");
    socket = new WebSocket(`ws://${host}:${port}`);
  });
  socket.addEventListener('message', event => {
    let data = fromMessage(event.data);
    console.log('Received:', data);
    onMessageCb(data);
  });

  let onOpenCb = noop;
  let onMessageCb = noop;

  return Object.freeze({
    request(count){
      send({ type: messageTypes.GIVE, count: count });
    },
    onOpen(cb) {
      onOpenCb = cb;
    },
    onReceived(cb) {
      onMessageCb = cb;
    }
  });
  function send(o) {
    socket.send(message(o));
  }
}

function fromMessage(msg) {
  return JSON.parse(msg);
}
function message(o) {
  return JSON.stringify(o);
}