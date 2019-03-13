import './list_photo_item.css';

import { element } from "../utils/HtmlUtils";
import listItem from './list_item';

export default function inst(photo) {
  return listItem(
    image(photo.url),
    title(photo.title)
  );
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
