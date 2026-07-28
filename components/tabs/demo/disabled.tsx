import { useState } from "react";
import { Button, TabPanel, Tabs } from "react-kui";
export default function App() {
  const [value, setValue] = useState("1");
  const [disabled, setDisabled] = useState(true);
  return (
    <>
      <Button size="small" onClick={() => setDisabled((x) => !x)}>
        {disabled ? "Enable" : "Disable"} Tab 2
      </Button>
      <Tabs value={value} onChange={setValue}>
        <TabPanel key="1" title="Tab 1">
          Content 1
        </TabPanel>
        <TabPanel key="2" title="Tab 2" disabled={disabled}>
          Content 2
        </TabPanel>
        <TabPanel key="3" title="Tab 3">
          Content 3
        </TabPanel>
      </Tabs>
    </>
  );
}
