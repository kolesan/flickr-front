import './control_panel_item.css';
import './control_panel_number_input.css';

import log from "../utils/Logging";
import { minmax } from "../utils/MathUtils";
import { decorateElement } from "../utils/HtmlUtils";
import newInput from "./control_panel_input";

export default function inst({min, max, value, name, onChange}) {
  let minMax = minmax(min, max);

  let input = newInput({value, name});

  return decorateElement(input, {
    attributes: {
      type: "number",
      min,
      max
    },
    listeners: {
      blur: event => {
        value = minMax(Number(event.target.value));
        event.target.value = value;
        onChange(value);
        log(`new value in ${name}: `, value);
      }
    }
  });
}
