import { Button, Flex, Space, Tooltip } from "react-kui";
const title = "Title";
const item = (placement: Parameters<typeof Tooltip>[0]["placement"], label: string) => (
  <Tooltip key={placement} placement={placement} title={title}>
    <Button>{label}</Button>
  </Tooltip>
);
export default function App() {
  return (
    <Flex style={{ width: 300 }} vertical align="center">
      <Space compact>
        {item("top-left", "TL")}
        {item("top", "Top")}
        {item("top-right", "TR")}
      </Space>
      <Flex justify="space-between" style={{ width: "100%", padding: "10px 0" }}>
        <Space vertical compact>
          {item("left-top", "LT")}
          {item("left", "Left")}
          {item("left-bottom", "LB")}
        </Space>
        <Space vertical compact>
          {item("right-top", "RT")}
          {item("right", "Right")}
          {item("right-bottom", "RB")}
        </Space>
      </Flex>
      <Space compact>
        {item("bottom-left", "BL")}
        {item("bottom", "Bottom")}
        {item("bottom-right", "BR")}
      </Space>
    </Flex>
  );
}
