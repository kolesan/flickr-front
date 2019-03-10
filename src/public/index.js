import './style.css';

import log from "./utils/Logging";
import {
  appendChildrenToHead, appendChildrenToTail, element, nextNthSibling,
  removeChildNodes
} from "./utils/HtmlUtils";
import photoProvider, { Sizes } from './services/Photos';
import { div } from "./utils/MathUtils";
import { pushToFront } from "./utils/Utils";

let list = document.querySelector("#list");

let firstPage = 0;
let lastPage = 3;

let topBuffer = [];
let bottomBuffer = [];

function isEntryBottom(entry) {
  return entry.boundingClientRect.top >= 0;
}
let bottomObserverHideCallback = observerCallback((isIntersecting, isBottom, entry) => {
  if (isBottom && !isIntersecting) {
    console.log("Should be hiding bot pictures");
    let count = 1;
    hidePicturesBottom(count);
    positionBottomHideObserver(nextNthSibling(entry.target, -count));
    positionBottomLoadObserver(nextNthSibling(entry.target, 2));
  }
});
let bottomObserverLoadCallback = observerCallback((isIntersecting, isBottom, entry) => {
  if (isBottom && isIntersecting && entry.intersectionRatio < 1) {
    console.log("Should be loading bot pictures");
    let count = 1;
    showPicturesBottom(count);
    if (bottomBuffer.length < 10) {
      loadPicturesBottom();
    }
    positionBottomLoadObserver(nextNthSibling(entry.target, count));
    positionBottomHideObserver(nextNthSibling(entry.target, -2));
  }
});
let topObserverLoadCallback = observerCallback((isIntersecting, isBottom, entry) => {
  let isTop = !isBottom;
  if (isTop && isIntersecting && entry.intersectionRatio < 1) {
    console.log("Should be loading top pictures");
    let count = 1;
    showPicturesTop(count);
    positionTopLoadObserver(nextNthSibling(entry.target, -count));
    positionTopHideObserver(nextNthSibling(entry.target, 2));
  }
});
let topObserverHideCallback = observerCallback((isIntersecting, isBottom, entry) => {
  let isTop = !isBottom;
  if (isTop && !isIntersecting) {
    console.log("Should be hiding top pictures");
    let count = 1;
    hidePicturesTop(count);
    positionTopHideObserver(nextNthSibling(entry.target, count));
    positionTopLoadObserver(entry.target);
  }
});
function observerCallback(fn) {
  return function(entries, observer) {
    let entry = entries[0];
    let { isIntersecting } = entry;
    let isBottom = isEntryBottom(entry);

    return fn(isIntersecting, isBottom, entry);
  }
}

let observerOptions = {
  rootMargin: "600px 0px"
};
// let hideObserverOptions = {
//
// };

let bottomHideObserver = new IntersectionObserver(bottomObserverHideCallback ,observerOptions);
let topHideObserver = new IntersectionObserver(topObserverHideCallback, observerOptions);
let bottomLoadObserver = new IntersectionObserver(bottomObserverLoadCallback, observerOptions);
let topLoadObserver = new IntersectionObserver(topObserverLoadCallback, observerOptions);

loadPicturesBottom()
  .then(loadPicturesBottom)
  .then(loadPicturesBottom)
  .then(loadPicturesBottom)
  .then(() => {
    showPicturesBottom(20);
    positionTopHideObserver(list.children[5]);
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
      log("bottomBuffer loaded", bottomBuffer);
      return listItems;
    });
}
function loadPicturesTop() {
  firstPage--;
  return getPhotos(firstPage)
    .then(resp => generateListItems(resp.data))
    .then(listItems => {
      pushToFront(topBuffer, listItems);
      return listItems;
    });
}

function showPicturesBottom(count) {
  let listItems = bottomBuffer.splice(0, count);
  appendChildrenToTail(list, listItems);
  log("bottomBuffer", bottomBuffer);
  return listItems;
}
function showPicturesTop(count) {
  let listItems = topBuffer.splice(-count);
  appendChildrenToHead(list, listItems);
  log("topBuffer", topBuffer);
}

function hidePicturesBottom(count) {
  let removedListItems = removeChildNodes(list, (child, i) => {
    return i >= list.children.length - count;
  });
  pushToFront(bottomBuffer, ...removedListItems);
  log("bottomBuffer", bottomBuffer);
}
function hidePicturesTop(count) {
  let removedListItems = removeChildNodes(list, (child, i) =>
    i < count
  );
  topBuffer.push(...removedListItems);
  log("topBuffer", topBuffer);
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