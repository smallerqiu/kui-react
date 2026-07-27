import { useState } from "react";
import { TabPanel, Tabs } from "react-kui";
export default function Sample() {
  const [value, setValue] = useState("1");
  return (
    <div className="demo-view-fill">
      <Tabs value={value} onChange={setValue} sample>
        {[1, 2, 3].map((x) => (
          <TabPanel key={x} title={`Tab ${x}`}>
            <p>Content of Tab Pane {x}</p>
            <p>Content of Tab Pane {x}</p>
            <p>Content of Tab Pane {x}</p>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
}
