import './style.css';

import log from "./utils/Logging";
import {
  appendChildrenToHead, appendChildrenToTail, element, nextSibling,
  removeChildNodes
} from "./utils/HtmlUtils";
import photoProvider, { Sizes } from './services/Photos';
import { div } from "./utils/MathUtils";
import { pushToFront } from "./utils/Utils";

const MAX_BUFFER_SIZE = 100;
const PHOTO_PAGE_SIZE = 10;
const OBSERVER_MARGIN = 3 * 300; //3 list items
const ITEM_LOAD_COUNT = 1;

let list = document.querySelector("#list");

let firstPage = 0;
let lastPage = 0;

let topBuffer = [];
let bottomBuffer = [];

// let topTarget;
// let botTarget;

let bottomObserverLoadCallback = observerCallback((isIntersecting, isBottom) => {
  if (isBottom && isIntersecting) {
    // setTimeout(() => {
    console.log("BOT LOAD");

    botObserver.disconnect();
    topObserver.disconnect();

    let shownPictures = showPicturesBot(ITEM_LOAD_COUNT);
    if (shownPictures) {
      hidePicturesTop(ITEM_LOAD_COUNT);
    }

    positionTopLoadObserver(list.children[3]);
    positionBotLoadObserver(list.children[16]);

    if (bottomBuffer.length < 50) {
      loadPicturesBottom();
    }
    // }, 0);
  }
});
let topObserverLoadCallback = observerCallback((isIntersecting, isBottom) => {
  // console.log("TOP OBSERVER TRIGGERED");
  if (!isBottom && isIntersecting) {
    // setTimeout(() => {
      console.log("TOP LOAD");

      botObserver.disconnect();
      topObserver.disconnect();

      let shownPictures = showPicturesTop(ITEM_LOAD_COUNT);
      if (shownPictures.length > 0) {
        hidePicturesBot(ITEM_LOAD_COUNT);
      }

      positionTopLoadObserver(list.children[3]);
      positionBotLoadObserver(list.children[16]);

      if (topBuffer.length < 50) {
        loadPicturesTop();
      }
    // }, 0);
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

let botObserver = new IntersectionObserver(bottomObserverLoadCallback, observerOptions);
let topObserver = new IntersectionObserver(topObserverLoadCallback, observerOptions);

loadPicturesBottom()
  .then(loadPicturesBottom)
  .then(() => {
    showPicturesBot(20);

    // topTarget = list.children[9];
    // botTarget = list.children[14];
    // positionTopLoadObserver(topTarget);
    // positionBotLoadObserver(botTarget);
    positionTopLoadObserver(list.children[3]);
    positionBotLoadObserver(list.children[16]);
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

function showPicturesBot(count) {
  let listItems = bottomBuffer.splice(0, count);
  appendChildrenToTail(list, listItems);
  log("bottomBuffer", bottomBuffer.length);
  return listItems;
}
function showPicturesTop(count) {
  let listItems = topBuffer.splice(-count);
  appendChildrenToHead(list, listItems);
  log("topBuffer", topBuffer.length, listItems);
  return listItems;
}

function hidePicturesBot(count) {
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



function debugElem(text, color) {
  let elem = element({
    tag: "div",
    text: text
  });
  Object.assign(elem.style, {
    textAlign: "right",
    color: "white",
    width: "10%",
    height: "100%",
    backgroundColor: color,
    position: "absolute",
    left: "90%",
    top: "0"
  });
  return elem
}
let bottomLoadDebugElem = debugElem("BOTTOM LOAD", "blue");
let topLoadDebugElem = debugElem("TOP LOAD", "red");

function positionTopLoadObserver(target) {
  target.appendChild(topLoadDebugElem);

  topObserver.observe(target);
}
function positionBotLoadObserver(target) {
  target.appendChild(bottomLoadDebugElem);

  botObserver.observe(target);
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