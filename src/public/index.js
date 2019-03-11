import './style.css';
import 'intersection-observer';

import log from "./utils/Logging";
import { appendChildren } from "./utils/HtmlUtils";
import { minmax } from "./utils/Utils";
import { ifAny } from "./utils/FunctionalUtils";
import newPhotoProvider from './services/Photos';
import newControlPanelInst from "./components/control_panel";
import newControlPanelIndicator from "./components/control_panel_indicator";
import newList from "./components/list";
import newObserver from "./ListScrollObserver";

const REQUESTED_PHOTOS_COUNT = 100;

let itemLoadCount = 1;

let controlPanelIndicator = newControlPanelIndicator();
let controlPanel = newControlPanelInst();
let { loadCountInput } = controlPanel.components;
loadCountInput.value = itemLoadCount;
let minMax1to10 = minmax(1, 10);
loadCountInput.onBlur(event => {
  itemLoadCount = minMax1to10(Number(event.target.value));
  loadCountInput.value = itemLoadCount;
  log(itemLoadCount);
});
appendChildren(document.body, controlPanelIndicator, controlPanel.element);


let observer = newObserver(() => {
  console.log("OBSERVER CB TRIGGERED: LOADING PICTURES");

  list.show(itemLoadCount)
    [ifAny](shown => {
      observer.position(getObserverTarget())
    });

  if (list.bufferLength < 50) {
    photos.request(REQUESTED_PHOTOS_COUNT);
  }
});

function getObserverTarget() {
  return list.items.slice(-10)[0];
}

let list = newList(document.body);
let photos = newPhotoProvider();
photos.onReceived(pictures => {
  log("Received pictures", pictures);
  list.buffer(pictures);
  list.show(20)
    [ifAny](shown => {
      observer.position(getObserverTarget())
    });
});
photos.onOpen(() => photos.request(REQUESTED_PHOTOS_COUNT));