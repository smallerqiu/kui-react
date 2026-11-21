import { useState } from "react";
import { Flex, Splitter, SplitterPanel } from "react-kui";
export default function App() {
  const [preview, setPreview] = useState<number[]>([]);
  const [applied, setApplied] = useState<number[]>([]);
  return (
    <>
      <Splitter lazy style={{ height: 220 }} onResize={setPreview} onChange={setApplied}>
        <SplitterPanel size="35%" min="100px">
          <Flex align="center" justify="center" style={{ height: "100%" }}>
            Chart
          </Flex>
        </SplitterPanel>
        <SplitterPanel min="100px">
          <Flex align="center" justify="center" style={{ height: "100%" }}>
            Editor
          </Flex>
        </SplitterPanel>
      </Splitter>
      <div>
        <code>preview: {preview.map((size) => Math.round(size)).join(", ")}</code>
      </div>
      <div>
        <code>applied: {applied.map((size) => Math.round(size)).join(", ")}</code>
      </div>
    </>
  );
}
