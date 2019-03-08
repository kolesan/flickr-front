import './style.css';

import { element } from "./utils/HtmlUtils";
import photoProvider, { Sizes } from './services/Photos';
import { div } from "./utils/MathUtils";

let list = document.querySelector("#list");
let lastItemPosition = 0;

let observerOptions = {
  // treshold: 1.0,
  // rootMargin: "1000px 0px"
};
let observerCallback = function(entries, observer){
  if (entries[0].isIntersecting) {
    console.log("Should be loading pictures");
    photoProvider.getMultiple(5, div(lastItemPosition, 5), Sizes.m)
      .then(resp => {
        let photos = resp.data;
        console.log(photos);
        let listItems = generateListItems(photos, lastItemPosition);
        console.log(listItems);
        listItems.forEach(item => list.appendChild(item));
        let target = listItems[1];
        console.log(target);
        observer.disconnect();
        observer.observe(target);
        lastItemPosition = lastItemPosition + 5;
      })
  }
};
let observer = new IntersectionObserver(
  observerCallback,
  observerOptions
);
// observer.observe(list);

const receivedPhotosPromise = photoProvider.getMultiple(5, div(lastItemPosition, 5), Sizes.m);
receivedPhotosPromise
  .then(resp => {
    let photos = resp.data;
    let listItems = generateListItems(photos, lastItemPosition);
    listItems.forEach(item => list.appendChild(item));
    let target = listItems[1];
    console.log(target);
    observer.disconnect();
    observer.observe(target);
    lastItemPosition = lastItemPosition + 5;
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });

function addPhotos() {

}

function generateListItems(photos, indexOffset) {
  let items = photos.map(listItem);
  items.forEach((item, i) => item.dataset.position = indexOffset + i);
  return items;
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