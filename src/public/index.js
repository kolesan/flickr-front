import './style.css';
import 'intersection-observer';

import log from "./utils/Logging";
import {
  appendChildrenToHead, appendChildrenToTail, element,
  removeChildNodes
} from "./utils/HtmlUtils";
import photoProvider, { Sizes } from './services/Photos';
import { div } from "./utils/MathUtils";
import { minmax, pushToFront } from "./utils/Utils";
import { ifAny } from "./utils/FunctionalUtils";
import newControlPanelInst from "./components/control_panel";
import controlPanelIndicator from "./components/control_panel_indicator";

const MAX_BUFFER_SIZE = 100;
const PHOTO_PAGE_SIZE = 10;
const OBSERVER_MARGIN = 3 * 300; //3 list items
const ITEM_HEIGHT = 300 + 8; //Height + margin

let detachTopMode = true;
let itemLoadCount = 1;

let controlPanel = newControlPanelInst();
let { topDetachmentBtn, loadCountInput } = controlPanel.components;
topDetachmentBtn.setState(detachTopMode);
topDetachmentBtn.bindClick(() => {
  detachTopMode = !detachTopMode;
  topDetachmentBtn.setState(detachTopMode);
});
loadCountInput.value = itemLoadCount;
let minMax1to10 = minmax(1, 10);
loadCountInput.onBlur(event => {
  itemLoadCount = minMax1to10(Number(event.target.value));
  loadCountInput.value = itemLoadCount;
  log(itemLoadCount);
});
appendChildrenToTail(document.body, controlPanelIndicator, controlPanel.element);


let list = document.querySelector("#list");

let firstPage = 0;
let lastPage = 0;

let topBuffer = [];
let bottomBuffer = [];
let paddingTop = 0;
let paddingBot = 0;

function moveListTop(count) {
  showPicturesBot(count)
    [ifAny](shown => {
      positionBotLoadObserver(list.children[list.children.length - 4]);

      if (detachTopMode) {
        hidePicturesTop(shown.length)
          [ifAny](hidden => {
            positionTopLoadObserver(list.children[3]);
          })
      }
    });
}
let bottomObserverCallback = observerCallback((isIntersecting, isBottom) => {
  console.log("BOT TRIGGERED");
  if (isIntersecting || !isBottom) {
    console.log("BOT LOAD");

    moveListTop(itemLoadCount);

    if (bottomBuffer.length < 50) {
      requestPicturesBottom()
        .then(pictures => {
          if (pictures.length > 0) {
            moveListTop(itemLoadCount);
          }
        });
    }
  }
});

function addPicturesTop(count) {
  showPicturesTop(count)
    [ifAny](shown => {
      positionTopLoadObserver(list.children[3]);

      hidePicturesBot(shown.length)
        [ifAny](hidden => {
          positionBotLoadObserver(list.children[list.children.length - 4]);
        })
    });
}
let topObserverCallback = observerCallback((isIntersecting, isBottom) => {
  console.log("TOP TRIGGERED");
  if (isIntersecting || isBottom) {
    console.log("TOP LOAD");

    addPicturesTop(itemLoadCount);

    if (topBuffer.length < 50) {
      loadPicturesTop()
        .then(loadedPictures => {
          if (loadedPictures.length > 0) {
            addPicturesTop(itemLoadCount);
          }
        });
    }
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

let botObserver = new IntersectionObserver(bottomObserverCallback, observerOptions);
let topObserver = new IntersectionObserver(topObserverCallback, observerOptions);

requestPicturesBottom()
  .then(requestPicturesBottom)
  .then(() => {
    showPicturesBot(20);
    positionBotLoadObserver(list.children[list.children.length - 4]);
  })
  .then(requestPicturesBottom)
  .then(requestPicturesBottom)
  .then(requestPicturesBottom)
  .then(requestPicturesBottom);

function getPhotos(page) {
  return photoProvider.getMultiple(page, Sizes.m);
}

function requestPicturesBottom() {
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
  return Promise.resolve([]);
}


function adjustBotPadding(times) {
  paddingBot += times * ITEM_HEIGHT; //Height + margin
  list.style.paddingBot = Math.max(0, paddingBot) + "px";
}
function adjustTopPadding(times) {
  paddingTop += times * ITEM_HEIGHT; //Height + margin
  list.style.paddingTop = Math.max(0, paddingTop) + "px";
}

function showPicturesBot(count) {
  let listItems = bottomBuffer.splice(0, count);
  log("bottomBuffer", bottomBuffer.length);
  appendChildrenToTail(list, ...listItems);
  adjustBotPadding(-listItems.length);
  return listItems;
}
function showPicturesTop(count) {
  let listItems = topBuffer.splice(-count);
  log("topBuffer", topBuffer.length, listItems);
  appendChildrenToHead(list, ...listItems);
  adjustTopPadding(-listItems.length);
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
  adjustBotPadding(removedListItems.length);
  return removedListItems;
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
  adjustTopPadding(removedListItems.length);
  return removedListItems;
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

  topObserver.disconnect();
  topObserver.observe(target);
}
function positionBotLoadObserver(target) {
  target.appendChild(bottomLoadDebugElem);

  botObserver.disconnect();
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