import { useState } from "react";
import { Button, Flex, Space, Splitter, SplitterPanel } from "react-kui";
export default function App() {
  const [sizes, setSizes] = useState([240, 556]);
  const [saved, setSaved] = useState([...sizes]);
  return (
    <Space vertical style={{ width: "100%" }}>
      <Space>
        <Button onClick={() => setSaved([...sizes])}>Save layout</Button>
        <Button onClick={() => setSizes([...saved])}>Restore layout</Button>
      </Space>
      <code>sizes: {sizes.map((size) => Math.round(size)).join(", ")}</code>
      <Splitter value={sizes} onChange={setSizes} style={{ height: 200 }}>
        <SplitterPanel min="100px">
          <Flex align="center" justify="center" style={{ height: "100%" }}>
            Left
          </Flex>
        </SplitterPanel>
        <SplitterPanel min="100px">
          <Flex align="center" justify="center" style={{ height: "100%" }}>
            Right
          </Flex>
        </SplitterPanel>
      </Splitter>
    </Space>
  );
}
