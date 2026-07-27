import { useState } from "react";
import { Flex, Splitter, SplitterPanel } from "react-kui";
const Panel = ({ children }: { children: string }) => (
  <Flex align="center" justify="center" style={{ height: "100%", color: "#888" }}>
    {children}
  </Flex>
);
export default function Basic() {
  const [sizes, setSizes] = useState<number[]>([]);
  return (
    <>
      <code>size: {sizes.map((x) => Math.round(x)).join(", ")}</code>
      <Splitter style={{ height: 200, width: "100%" }} onResize={setSizes}>
        <SplitterPanel>
          <Panel>Left</Panel>
        </SplitterPanel>
        <SplitterPanel>
          <Panel>Center</Panel>
        </SplitterPanel>
        <SplitterPanel>
          <Panel>Right</Panel>
        </SplitterPanel>
      </Splitter>
    </>
  );
}
