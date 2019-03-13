import './style.css';
import 'intersection-observer';

import log from "./utils/Logging";
import { ifAny, ifNone } from "./utils/FunctionalUtils";
import newPhotoProvider from './services/Photos';
import newControlPanel from "./components/control_panel";
import newControlPanelLabel from "./components/control_panel_label";
import newControlPanelInput from "./components/control_panel_input";
import newControlPanelNumberInput from "./components/control_panel_number_input";
import newList from "./components/list";
import newObserver from "./ListScrollObserver";
import { throttle } from "./utils/Utils";
const { newReserve } = require("../common_utils/Reserve");

const REQUESTED_PHOTOS_COUNT = 20;

let showCount = 1;
let tags = "";
let showCountInput = newControlPanelNumberInput({
  min: 1, max: 10,
  value: showCount,
  name: "showCount",
  onChange: value => showCount = value
});
let tagsInput = newControlPanelInput({
  value: tags,
  name: "tagsInput",
  onChange: value => {
    tags = value;
    list.clearBuffer();
  }
});

let reserve = newReserve(100);
let list = newList(document.body);
newControlPanel(document.body,
  newControlPanelLabel({label: "show on scroll", input: showCountInput}),
  newControlPanelLabel({label: "tags", input: tagsInput})
);
let observer = newObserver(() => {
  // console.log("OBSERVER CB TRIGGERED: LOADING PHOTOS");
  showReserved()
    [ifNone](() => {
      showListItems(showCount);
    });

  if (list.bufferLength < 20) {
    requestPhotos();
  }
});


let photos = newPhotoProvider();
photos.onOpen(() => {
  requestPhotos();
  reserve.add(20);
});
photos.onReceived(pictures => {
  log("Received pictures", pictures);
  list.buffer(pictures);
  showReserved();
});

let requestPhotos = throttle(500, () => photos.request(REQUESTED_PHOTOS_COUNT, tags));

function showReserved() {
  return showListItems(reserve.reserved)
    [ifAny](shown => {
      reserve.remove(shown.length);
    });
}

function showListItems(count) {
  return list.show(count)
    [ifAny](shown => {
      observer.position(getObserverTarget())
    });
}
function getObserverTarget() {
  return list.items.slice(-10)[0];
}