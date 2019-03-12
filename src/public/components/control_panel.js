import './control_panel.css';
import { appendChildren, element } from "../utils/HtmlUtils";
import newControlPanelIndicator from "./control_panel_indicator";

export let numberInputValue = 1;

export default function inst(container, ...children) {
  let controlPanelIndicator = newControlPanelIndicator();
  let controlPanel = panel();

  appendChildren(controlPanel, ...children);
  appendChildren(container, controlPanelIndicator, controlPanel);
}

function panel() {
  return element({
    tag: "div",
    classes: "control_panel",
  });
}
