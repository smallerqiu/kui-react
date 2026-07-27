import { useState } from "react";
import { Button, TabPanel, Tabs } from "react-kui";
export default function Extra() {
  const [value, setValue] = useState("1");
  return (
    <Tabs value={value} onChange={setValue} extra={<Button size="small">Extra Operate</Button>}>
      {[1, 2, 3].map((x) => (
        <TabPanel key={x} title={`Tab ${x}`}>
          Content of Tab Pane {x}
        </TabPanel>
      ))}
    </Tabs>
  );
}
