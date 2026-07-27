import { useState } from "react";
import { TabPanel, Tabs } from "../index";
export default function Centered() {
  const [value, setValue] = useState("1");
  return (
    <Tabs value={value} onChange={setValue} centered>
      {[1, 2, 3].map((x) => (
        <TabPanel key={x} title={`Tab ${x}`}>
          Content of Tab Pane {x}
        </TabPanel>
      ))}
    </Tabs>
  );
}
