import Space from "../../space";
import Badge from "../index";
const custom = ["#c20", "#39f", "#e3f", "#6c0"];
const colors = [
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
export default function Color() {
  return (
    <Space vertical block>
      Presets
      <Space wrap>
        {colors.map((color) => (
          <Badge key={color} color={color} text={color} />
        ))}
      </Space>
      <br />
      Custom
      {custom.map((color) => (
        <div key={color}>
          <Badge color={color} text={color} />
        </div>
      ))}
    </Space>
  );
}
