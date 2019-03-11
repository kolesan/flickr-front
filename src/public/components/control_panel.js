import './control_panel.css';

import { element } from "../utils/HtmlUtils";

export default function inst() {
  let topDetachmentBtn = topDetachmentBtnCmp();
  let gridModeBtn = gridModeBtnCmp();

  return {
    buttons: {
      topDetachmentBtn,
      gridModeBtn
    },
    element: element({
      tag: "div",
      classes: "control_panel",
      children: [
        topDetachmentBtn.element,
        gridModeBtn.element
      ]
    })
  };
}

function topDetachmentBtnCmp() {
  let buttonElement = element({
    tag: "button",
    classes: `control_panel__button`,
    text: "detach top"
  });

  return {
    bindClick(cb) {
      buttonElement.addEventListener("click", cb);
    },
    element: buttonElement,
    setState(state) {
      if (state) {
        buttonElement.classList.add("control_panel__button-active");
        buttonElement.innerHTML = "DETACH TOP ENABLED"
      } else {
        buttonElement.classList.remove("control_panel__button-active");
        buttonElement.innerHTML = "DETACH TOP DISABLED"
      }
    }
  };
}
function gridModeBtnCmp(params) {
  let buttonElement = element({
    tag: "button",
    classes: "control_panel__button",
    text: "grid mode",
    attributes: {
      disabled: true
    },
    listeners: {
      click: params && params.cb
    }
  });
  return {
    element: buttonElement
  }
}
