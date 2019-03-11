import './control_panel.css';

import { element, textNode } from "../utils/HtmlUtils";

export default function inst() {
  let loadCountInput = loadCountInputCmp();

  return {
    components: {
      loadCountInput,
    },
    element: element({
      tag: "div",
      classes: "control_panel",
      children: [
        loadCountInput.element
      ]
    })
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