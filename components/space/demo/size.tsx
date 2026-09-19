import { useState } from "react";
import { Button, Space, TabPanel, Tabs } from "react-kui";

export default function App() {
  const [current, setCurrent] = useState("1");
  return (
    <Tabs value={current} onChange={setCurrent} style={{ width: 350 }}>
      <TabPanel key="1" title="Small">
        <Space size="small">
          {Array.from({ length: 5 }, (_, index) => (
            <Button key={index}>Small</Button>
          ))}
        </Space>
      </TabPanel>
      <TabPanel key="2" title="Medium ">
        <Space size="medium">
          {Array.from({ length: 5 }, (_, index) => (
            <Button size="small" key={index}>
              Middle
            </Button>
          ))}
        </Space>
      </TabPanel>
      <TabPanel key="3" title="Large">
        <Space size="large">
          {Array.from({ length: 5 }, (_, index) => (
            <Button size="small" key={index}>
              Large
            </Button>
          ))}
        </Space>
      </TabPanel>
      <TabPanel key="4" title="Wrap">
        <Space size={[8, 20]} wrap>
          {Array.from({ length: 10 }, (_, index) => (
            <Button size="small" key={index}>
              Wrap
            </Button>
          ))}
        </Space>
      </TabPanel>
    </Tabs>
  );
}
