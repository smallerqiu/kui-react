import { Settings } from "kui-icons";
import { Icon, Collapse, CollapsePanel } from "react-kui";
import { text } from "./content";
export default function App() {
  const extra = <Icon type={Settings} />;
  return (
    <div className="demo-collapse">
      <Collapse defaultOpenKeys={[1, 2]}>
        {[1, 2, 3].map((key) => (
          <CollapsePanel key={key} title="Panel title" extra={extra}>
            <div>{text}</div>
          </CollapsePanel>
        ))}
      </Collapse>
    </div>
  );
}
