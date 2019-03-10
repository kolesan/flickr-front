import './style.css';

import log from "./utils/Logging";
import {
  appendChildrenToHead, appendChildrenToTail, element, nextNthSibling,
  removeChildNodes
} from "./utils/HtmlUtils";
import photoProvider, { Sizes } from './services/Photos';
import { div } from "./utils/MathUtils";
import { pushToFront } from "./utils/Utils";

const MAX_BUFFER_SIZE = 100;
const PHOTO_PAGE_SIZE = 10;
const OBSERVER_MARGIN = 3 * 300; //3 list items

let list = document.querySelector("#list");

let firstPage = 0;
let lastPage = 0;

let topBuffer = [];
let bottomBuffer = [];

let bottomObserverLoadCallback = observerCallback((isIntersecting, isBottom, entry) => {
  if (isBottom && isIntersecting) { // && entry.intersectionRatio < 1
    window.requestIdleCallback(() => {
      console.log("Should be loading bot pictures");
      let count = 1;
      showPicturesBottom(count);
      if (bottomBuffer.length < 50) {
        loadPicturesBottom();
      }
      positionBottomLoadObserver(nextNthSibling(entry.target, count));
      positionBottomHideObserver(nextNthSibling(entry.target, count - 3));
    });
  }
});
let topObserverLoadCallback = observerCallback((isIntersecting, isBottom, entry) => {
  let isTop = !isBottom;
  if (isTop && isIntersecting) { // && entry.intersectionRatio < 1
    window.requestIdleCallback(() => {
      console.log("Should be loading top pictures");
      let count = 1;
      showPicturesTop(count);
      if (topBuffer.length < 50) {
        loadPicturesTop();
      }
      positionTopLoadObserver(nextNthSibling(entry.target, -count));
      positionTopHideObserver(nextNthSibling(entry.target, -count + 3));
    });
  }
});

let bottomObserverHideCallback = observerCallback((isIntersecting, isBottom, entry) => {
  if (isBottom && !isIntersecting) {
    console.log("Should be hiding bot pictures");
    let count = 1;
    hidePicturesBottom(count);
    positionBottomHideObserver(nextNthSibling(entry.target, -count));
    positionBottomLoadObserver(nextNthSibling(entry.target, -count + 3));
  }
});
let topObserverHideCallback = observerCallback((isIntersecting, isBottom, entry) => {
  let isTop = !isBottom;
  if (isTop && !isIntersecting) {
    console.log("Should be hiding top pictures");
    let count = 1;
    hidePicturesTop(count);
    positionTopHideObserver(nextNthSibling(entry.target, count));
    positionTopLoadObserver(nextNthSibling(entry.target, count - 3));
  }
});

function isEntryBottom(entry) {
  return entry.boundingClientRect.top >= 0;
}
function observerCallback(fn) {
  return function(entries, observer) {
    let entry = entries[0];
    let { isIntersecting } = entry;
    let isBottom = isEntryBottom(entry);

    return fn(isIntersecting, isBottom, entry);
  }
}


let observerOptions = {
  rootMargin: `${OBSERVER_MARGIN}px 0px`
};

let bottomHideObserver = new IntersectionObserver(bottomObserverHideCallback, observerOptions);
let topHideObserver = new IntersectionObserver(topObserverHideCallback, observerOptions);
let bottomLoadObserver = new IntersectionObserver(bottomObserverLoadCallback, observerOptions);
let topLoadObserver = new IntersectionObserver(topObserverLoadCallback, observerOptions);

loadPicturesBottom()
  .then(loadPicturesBottom)
  .then(loadPicturesBottom)
  .then(loadPicturesBottom)
  .then(() => {
    showPicturesBottom(20);
    positionTopHideObserver(list.children[9]);
    positionBottomLoadObserver(list.children[14]);
  })
  .then(loadPicturesBottom)
  .then(loadPicturesBottom)
  .then(loadPicturesBottom)
  .then(loadPicturesBottom);

function getPhotos(page) {
  return photoProvider.getMultiple(page, Sizes.m);
}

function loadPicturesBottom() {
  lastPage++;
  return getPhotos(lastPage)
    .then(resp => generateListItems(resp.data))
    .then(listItems => {
      bottomBuffer.push(...listItems);
      log("bottomBuffer loaded", bottomBuffer.length);
      return listItems;
    });
}
function loadPicturesTop() {
  if (firstPage > 0) {
    firstPage--;
    log(`First page --`, firstPage);
    return getPhotos(firstPage)
      .then(resp => generateListItems(resp.data))
      .then(listItems => {
        pushToFront(topBuffer, ...listItems);
        log("topBuffer loaded", topBuffer.length);
        return listItems;
      });
  }
  return [];
}

function showPicturesBottom(count) {
  let listItems = bottomBuffer.splice(0, count);
  appendChildrenToTail(list, listItems);
  log("bottomBuffer", bottomBuffer.length);
  return listItems;
}
function showPicturesTop(count) {
  let listItems = topBuffer.splice(-count);
  appendChildrenToHead(list, listItems);
  log("topBuffer", topBuffer.length, listItems);
}

function hidePicturesBottom(count) {
  let removedListItems = removeChildNodes(list, (child, i) => {
    return i >= list.children.length - count;
  });
  pushToFront(bottomBuffer, ...removedListItems);
  while(bottomBuffer.length >= MAX_BUFFER_SIZE + PHOTO_PAGE_SIZE) {
    log(`Shortening bottom buffer by ${PHOTO_PAGE_SIZE}`);
    bottomBuffer.splice(-PHOTO_PAGE_SIZE);
  }
  log("bottomBuffer", bottomBuffer.length);
}
function hidePicturesTop(count) {
  let removedListItems = removeChildNodes(list, (child, i) =>
    i < count
  );
  topBuffer.push(...removedListItems);
  while(topBuffer.length >= MAX_BUFFER_SIZE + PHOTO_PAGE_SIZE) {
    log(`Shortening top buffer by ${PHOTO_PAGE_SIZE}`);
    firstPage++;
    log(`First page ++`, firstPage);
    topBuffer.splice(0, PHOTO_PAGE_SIZE);
  }
  log("topBuffer", topBuffer.length);
}



function debugElem(text) {
  let elem = element({
    tag: "div",
    text: text
  });
  elem.style.textAlign = "right";
  elem.style.color = "white";
  return elem
}
let bottomHideDebugElem = debugElem("BOTTOM HIDE");
let bottomLoadDebugElem = debugElem("BOTTOM SHOW");
let topHideDebugElem = debugElem("TOP HIDE");
let topLoadDebugElem = debugElem("TOP SHOW");

function positionTopHideObserver(target) {
  target.appendChild(topHideDebugElem);

  topHideObserver.disconnect();
  topHideObserver.observe(target);
}
function positionTopLoadObserver(target) {
  target.appendChild(topLoadDebugElem);

  topLoadObserver.disconnect();
  topLoadObserver.observe(target);
}
function positionBottomHideObserver(target) {
  target.appendChild(bottomHideDebugElem);

  bottomHideObserver.disconnect();
  bottomHideObserver.observe(target);
}
function positionBottomLoadObserver(target) {
  target.appendChild(bottomLoadDebugElem);

  bottomLoadObserver.disconnect();
  bottomLoadObserver.observe(target);
}

//   .catch(function (error) {
//     // handle error
//     console.log(error);
//   })
//   .then(function () {
//     // always executed
//   });

function generateListItems(photos) {
  return photos.map(listItem);
}

function listItem(photo) {
  return element({
    tag: "li",
    classes: "list__item",
    children: [
      image(photo.url),
      title(photo.title)
    ]
  })
}

function image(url) {
  return element({
    tag: 'img',
    classes: "list__item__img",
    attributes: {
      src: url
    }
  });
}

function title(text) {
  return element({
    tag: 'div',
    classes: "list__item__title",
    text: text
  });
}