import { useState } from "react";
import { TabPanel, Tabs } from "../index";
export default function Basic() {
  const [value, setValue] = useState("1");
  const [animated, setAnimated] = useState(false);
  return (
    <>
      <label>
        Animated:{" "}
        <input type="checkbox" checked={animated} onChange={(e) => setAnimated(e.target.checked)} />
      </label>
      <Tabs value={value} animated={animated} onChange={setValue}>
        {[1, 2, 3].map((x) => (
          <TabPanel key={x} title={`Tab ${x}`}>
            Content of Tab Pane {x}
          </TabPanel>
        ))}
      </Tabs>
    </>
  );
}
