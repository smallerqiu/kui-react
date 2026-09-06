import { useState } from "react";
import { TabPanel, Tabs } from "react-kui";
export default function App() {
  const [value, setValue] = useState("1");
  return (
    <div className="demo-view-fill">
      <Tabs value={value} onChange={setValue} sample>
        <TabPanel key="1" title="Tab 1">
          <p>Content of Tab Pane 1</p>
          <p>Content of Tab Pane 1</p>
          <p>Content of Tab Pane 1</p>
        </TabPanel>
        <TabPanel key="2" title="Tab 2">
          <p>Content of Tab Pane 2</p>
          <p>Content of Tab Pane 2</p>
          <p>Content of Tab Pane 2</p>
        </TabPanel>
        <TabPanel key="3" title="Tab 3">
          <p>Content of Tab Pane 3</p>
          <p>Content of Tab Pane 3</p>
          <p>Content of Tab Pane 3</p>
        </TabPanel>
      </Tabs>
    </div>
  );
}
