import './control_panel_item.css';
import './control_panel_number_input.css';

import { element, textNode } from "../utils/HtmlUtils";

export default function inst({label, input}) {

  return element({
    tag: "label",
    classes: `control_panel__item label`,
    children: [
      textNode(label),
      input
    ]
  });

}
