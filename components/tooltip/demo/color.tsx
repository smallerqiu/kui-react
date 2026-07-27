import Divider from "../../divider";
import Space from "../../space";
import Tag from "../../tag";
import Tooltip from "../index";
const custom = ["#c20", "#39f", "#e3f", "#6c0"],
  colors = [
    "pink",
    "red",
    "yellow",
    "orange",
    "cyan",
    "green",
    "blue",
    "purple",
    "magenta",
    "volcano",
    "gold",
    "lime",
  ];
const list = (values: string[]) =>
  values.map((color) => (
    <Tooltip key={color} color={color} title={color}>
      <Tag color={color}>{color}</Tag>
    </Tooltip>
  ));
export default function Color() {
  return (
    <div className="demo-tooltip-color">
      <Divider orientation="left">Presets:</Divider>
      <Space wrap>{list(colors)}</Space>
      <Divider orientation="left">Custom:</Divider>
      <Space>{list(custom)}</Space>
    </div>
  );
}
