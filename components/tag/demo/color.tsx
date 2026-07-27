import Space from "../../space";
import Tag from "../index";
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
  ],
  custom = ["#c20", "#39f", "#e3f", "#6c0"];
export default function Color() {
  return (
    <div>
      <h4 style={{ marginBottom: 16 }}>Presets:</h4>
      <Space wrap>
        {colors.map((color) => (
          <Tag key={color} color={color}>
            {color}
          </Tag>
        ))}
      </Space>
      <h4 style={{ margin: "16px 0" }}>Custom:</h4>
      <Space>
        {custom.map((color) => (
          <Tag key={color} color={color}>
            {color}
          </Tag>
        ))}
      </Space>
    </div>
  );
}
