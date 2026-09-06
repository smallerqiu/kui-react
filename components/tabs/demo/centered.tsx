import { useState } from "react";
import { TabPanel, Tabs } from "react-kui";
export default function App() {
  const [value, setValue] = useState("1");
  return (
    <Tabs value={value} onChange={setValue} centered>
      <TabPanel key="1" title="Tab 1">
        Content of Tab Pane 1
      </TabPanel>
      <TabPanel key="2" title="Tab 2">
        Content of Tab Pane 2
      </TabPanel>
      <TabPanel key="3" title="Tab 3">
        Content of Tab Pane 3
      </TabPanel>
    </Tabs>
  );
}
