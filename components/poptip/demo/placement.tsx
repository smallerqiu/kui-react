import { Button, Flex, Space, Poptip } from "react-kui";

const tip = "See the light through the mist!";
const item = (placement: Parameters<typeof Poptip>[0]["placement"], label: string) => (
  <Poptip
    key={placement}
    placement={placement}
    title="Title"
    content={
      <>
        <p>{tip}</p>
        <p>{tip}</p>
      </>
    }
  >
    <Button>{label}</Button>
  </Poptip>
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
