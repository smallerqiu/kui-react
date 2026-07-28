import { Flex, Splitter, SplitterPanel } from "react-kui";
const Panel = ({ children }: { children: string }) => (
  <Flex align="center" justify="center" style={{ height: "100%", color: "#888" }}>
    {children}
  </Flex>
);
export default function App() {
  return (
    <Splitter direction="horizontal" style={{ height: 240 }}>
      <SplitterPanel size="20%" min={10} max={30}>
        <Panel>Folders</Panel>
      </SplitterPanel>
      <SplitterPanel>
        <Splitter direction="vertical">
          <SplitterPanel>
            <Panel>Editor</Panel>
          </SplitterPanel>
          <SplitterPanel size="25%">
            <Panel>Console</Panel>
          </SplitterPanel>
        </Splitter>
      </SplitterPanel>
    </Splitter>
  );
}
