import { Collapse, CollapsePanel } from "react-kui";
import { text } from "./content";
export default function App() {
  return (
    <div className="demo-collapse">
      <Collapse openKeys={["1"]}>
        <CollapsePanel key="1" title="Panel title">
          <Collapse openKeys={["1-1"]}>
            <CollapsePanel key="1-1" title="Panel title">
              <div>{text}</div>
            </CollapsePanel>
            <CollapsePanel key="1-2" title="Panel title">
              <div>{text}</div>
            </CollapsePanel>
          </Collapse>
        </CollapsePanel>
        <CollapsePanel key="2" title="Panel title">
          <div>{text}</div>
        </CollapsePanel>
        <CollapsePanel key="3" title="Panel title">
          <div>{text}</div>
        </CollapsePanel>
      </Collapse>
    </div>
  );
}
