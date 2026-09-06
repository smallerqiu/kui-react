import { useState } from "react";
import { Switch, TabPanel, Tabs } from "react-kui";
export default function App() {
  const [value, setValue] = useState("1");
  const [animated, setAnimated] = useState(false);
  return (
    <>
      Animated: <Switch checked={animated} onChange={(value) => setAnimated(Boolean(value))} />
      <Tabs value={value} animated={animated} onChange={setValue}>
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
    </>
  );
}
