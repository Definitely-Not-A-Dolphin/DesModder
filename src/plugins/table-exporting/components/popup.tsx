import { Button } from "#components";
import { Component, jsx } from "#DCGView";
import { Console } from "#globals";
import "./popup.less";

export class Popup extends Component {
  template() {
    return (
      <div class="dcg-popover-interior dsm-table-exporting-context-menu">
        <ul>
          <li>
            <Button
              color="light-gray"
              class="dsm-table-exporting-context-menu-button"
              onTap={() => {
                Console.log("press...");
              }}
            >
              {"Button 1"}
            </Button>
          </li>
          <li>
            <Button
              color="light-gray"
              class="dsm-table-exporting-context-menu-button"
              onTap={() => {
                Console.log("press...");
              }}
            >
              {"Button 2"}
            </Button>
          </li>
        </ul>
      </div>
    );
  }
}
