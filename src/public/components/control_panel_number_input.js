import './control_panel_item.css';
import './control_panel_number_input.css';

import log from "../utils/Logging";
import { minmax } from "../utils/MathUtils";
import { element, textNode } from "../utils/HtmlUtils";

export default function inst({min, max, value, name, label, onChange}) {
  let minMax = minmax(min, max);

  let input = element({
    tag: "input",
    classes: `control_panel__item input`,
    attributes: {
      type: "number",
      name,
      min,
      max
    },
    value,
    listeners: {
      blur: event => {
        value = minMax(Number(event.target.value));
        event.target.value = value;
        onChange(value);
        log(`new value in ${name}: `, value);
      }
    }
  });

  return element({
    tag: "label",
    classes: `control_panel__item label`,
    children: [
      textNode(label),
      input
    ]
  });
}
