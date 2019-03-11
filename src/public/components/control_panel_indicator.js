import './control_panel_indicator.css';

import { element } from "../utils/HtmlUtils";

export default function inst() {
  return element({
    tag: "div",
    classes: "control_panel_indicator",
    text: "<-"
  });
}