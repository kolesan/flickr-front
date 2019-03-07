import './style.css';

import { element } from "./utils/HtmlUtils";
import photoProvider, { Sizes } from './services/Photos';

let list = document.querySelector("#list");

const receivedPhotosPromise = photoProvider.getMultiple(5, Sizes.m);

receivedPhotosPromise
  .then(resp => {
    let photoUrls = resp.data;
    console.log(photoUrls);
    photoUrls.forEach(url => {
      list.appendChild(
        element({
          tag: "li",
          children: [
            element({
              tag: 'img',
              attributes: {
                src: url
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
