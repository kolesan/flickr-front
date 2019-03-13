import './control_panel_item.css';
import './control_panel_number_input.css';

import log from "../utils/Logging";
import { element } from "../utils/HtmlUtils";

export default function inst({value, name, onChange}) {

  return element({
    tag: "input",
    classes: `control_panel__item input`,
    attributes: {
      name
    },
    value,
    listeners: onChange ? {
      blur: event => {
        let value = event.target.value;
        onChange(value);
        log(`new value in ${name}: `, value);
      }
    } : {}
  });

}
