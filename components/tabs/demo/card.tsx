import { useState } from "react";
import { TabPanel, Tabs } from "react-kui";
export default function App() {
  const [value, setValue] = useState("1");
  return (
    <Tabs value={value} onChange={setValue} card>
      {[1, 2, 3].map((x) => (
        <TabPanel key={x} title={`Tab ${x}`}>
          Content of Tab Pane {x}
        </TabPanel>
      ))}
    </Tabs>
  );
}
