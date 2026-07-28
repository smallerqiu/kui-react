import { LogoApple, LogoMicrosoft } from "kui-icons";
import { useState } from "react";
import { TabPanel, Tabs } from "react-kui";
export default function App() {
  const [value, setValue] = useState("1");
  return (
    <Tabs value={value} onChange={setValue}>
      <TabPanel key="1" title="Apple" icon={LogoApple}>
        Content of Apple tab
      </TabPanel>
      <TabPanel key="2" title="Microsoft" icon={LogoMicrosoft}>
        Content of Microsoft tab
      </TabPanel>
    </Tabs>
  );
}
