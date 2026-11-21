import { useState } from "react";
import { Flex, Splitter, SplitterPanel } from "react-kui";
export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <Splitter style={{ height: 220 }}>
        <SplitterPanel
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          size="25%"
          min="100px"
          collapsible
        >
          <Flex align="center" justify="center" style={{ height: "100%" }}>
            Folders
          </Flex>
        </SplitterPanel>
        <SplitterPanel>
          <Flex align="center" justify="center" style={{ height: "100%" }}>
            Editor
          </Flex>
        </SplitterPanel>
        <SplitterPanel size="120px" resizable={false}>
          <Flex align="center" justify="center" style={{ height: "100%" }}>
            Locked
          </Flex>
        </SplitterPanel>
      </Splitter>
      <code>collapsed: {String(collapsed)}</code>
    </>
  );
}
