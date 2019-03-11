import { element } from "../utils/HtmlUtils";

export function intersectionObserverDebugElement(text, color) {
  return element({
    tag: "div",
    text: text,
    style: {
      textAlign: "right",
      color: "white",
      width: "10%",
      height: "100%",
      backgroundColor: color,
      position: "absolute",
      left: "90%",
      top: "0"
    }
  });
}