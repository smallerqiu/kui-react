import { Settings } from "kui-icons";
import Icon from "../../icon";
import { Collapse, CollapsePanel } from "../index";
import { text } from "./content";
export default function Extra() { const extra = <Icon type={Settings} />; return <div className="demo-collapse"><Collapse openKeys={["1", "2"]}>{[1, 2, 3].map((key) => <CollapsePanel key={key} title="Panel title" extra={extra}><div>{text}</div></CollapsePanel>)}</Collapse></div>; }
