import './style.css';

import { element } from "./utils/HtmlUtils";
import photoProvider, { Sizes } from './services/Photos';

let list = document.querySelector("#list");

const receivedPhotosPromise = photoProvider.getMultiple(10, Sizes.m);

receivedPhotosPromise
  .then(resp => {
    let photos = resp.data;
    console.log(photos);
    photos.forEach(photo => {
      list.appendChild(
        element({
          tag: "li",
          classes: "list__item",
          children: [
            element({
              tag: 'img',
              attributes: {
                src: photo.url
              }
            })
          ]
        })
      );
    });
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });
