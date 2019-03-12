import './style.css';
import 'intersection-observer';

import log from "./utils/Logging";
import { ifAny, ifNone } from "./utils/FunctionalUtils";
import newPhotoProvider from './services/Photos';
import newControlPanel from "./components/control_panel";
import newControlPanelNumberInput from "./components/control_panel_number_input";
import newList from "./components/list";
import newObserver from "./ListScrollObserver";
import newReserve from "./Reserve";

const REQUESTED_PHOTOS_COUNT = 100;

let showCount = 1;
let showCountInput = newControlPanelNumberInput({
  label: "show count",
  min: 1, max: 10,
  value: showCount,
  name: "showCount",
  onChange: value => showCount = value
});

let reserve = newReserve();
let list = newList(document.body);
newControlPanel(document.body, showCountInput);
let observer = newObserver(() => {
  // console.log("OBSERVER CB TRIGGERED: LOADING PICTURES");
  showReserved()
    [ifNone](() => {
      showListItems(showCount);
    });

  if (list.bufferLength < 50) {
    photos.request(REQUESTED_PHOTOS_COUNT);
  }
});


let photos = newPhotoProvider();
photos.onOpen(() => {
  photos.request(REQUESTED_PHOTOS_COUNT);
  reserve.add(20);
});
photos.onReceived(pictures => {
  log("Received pictures", pictures);
  list.buffer(pictures);
  showReserved();
});

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