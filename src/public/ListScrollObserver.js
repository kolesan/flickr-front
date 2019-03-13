import { intersectionObserverDebugElement } from "./components/debug";
import { removeElement } from "./utils/HtmlUtils";

const ITEM_HEIGHT = 300 + 8; //Height + margin
const OBSERVER_MARGIN = 3 * ITEM_HEIGHT;

export default function inst(cb) {
  let observer = new IntersectionObserver(observerCallback, {
    rootMargin: `${OBSERVER_MARGIN}px 0px`
  });

  function observerCallback(entries, observer) {
    console.log("BOT TRIGGERED");
    let entry = entries[0];
    let { isIntersecting } = entry;
    let isBottom = entry.boundingClientRect.top >= 0;

    if (isIntersecting || !isBottom) {
      cb(isIntersecting, isBottom);
    }
  }

  let bottomLoadDebugElem = intersectionObserverDebugElement("LOAD", "red");

  return Object.freeze({
    position(target) {
      if (!CONFIG.production) {
        target.appendChild(bottomLoadDebugElem)
      };

      observer.disconnect();
      observer.observe(target);
    },
    disable() {
      removeElement(bottomLoadDebugElem);
      observer.disconnect();
    }
  });
}
