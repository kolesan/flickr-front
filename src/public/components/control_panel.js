import './control_panel.css';

import { element, textNode } from "../utils/HtmlUtils";

export default function inst() {
  let topDetachmentBtn = topDetachmentBtnCmp();
  let loadCountInput = loadCountInputCmp();
  let gridModeBtn = gridModeBtnCmp();

  return {
    components: {
      topDetachmentBtn,
      loadCountInput,
      gridModeBtn
    },
    element: element({
      tag: "div",
      classes: "control_panel",
      children: [
        topDetachmentBtn.element,
        loadCountInput.element,
        gridModeBtn.element
      ]
    })
  };
}

function topDetachmentBtnCmp() {
  let buttonElement = element({
    tag: "button",
    classes: `control_panel__item button`
  });

  return {
    bindClick(cb) {
      buttonElement.addEventListener("click", cb);
    },
    element: buttonElement,
    setState(state) {
      if (state) {
        buttonElement.classList.add("button-active");
        buttonElement.innerHTML = "TOP OBSERVER ENABLED"
      } else {
        buttonElement.classList.remove("button-active");
        buttonElement.innerHTML = "TOP OBSERVER DISABLED"
      }
    }
  };
}

function loadCountInputCmp() {
  let input = element({
    tag: "input",
    classes: `control_panel__item input`,
    attributes: {
      type: "number",
      min: 1,
      max: 10
    }
  });
  let label = element({
    tag: "label",
    classes: `control_panel__item label`,
    children: [
      textNode("LOAD COUNT"),
      input
    ]
  });

  return {
    set value(v) {
      input.value = v;
    },
    onBlur(cb) {
      input.addEventListener("blur", cb);
    },
    element: label
  };
}

function gridModeBtnCmp(params) {
  let buttonElement = element({
    tag: "button",
    classes: "control_panel__item button",
    text: "grid mode disabled",
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
