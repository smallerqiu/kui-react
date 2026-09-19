import { Plus } from "kui-icons";
import { useRef, useState } from "react";
import { Button, TabPanel, Tabs } from "react-kui";

interface Panel {
  key: string;
  title: string;
  content: string;
  closable: boolean;
}

const initialPanels: Panel[] = [
  { key: "1", title: "Welcome", content: "Welcome page", closable: false },
  { key: "2", title: "Components", content: "Components page", closable: true },
  { key: "3", title: "Settings", content: "Settings page", closable: true },
];

export default function App() {
  const [panels, setPanels] = useState(initialPanels);
  const [activeKey, setActiveKey] = useState("1");
  const index = useRef(3);

  const add = () => {
    const key = String(++index.current);
    setPanels((items) => [
      ...items,
      { key, title: `New Tab ${key}`, content: `Content of new Tab ${key}`, closable: true },
    ]);
    setActiveKey(key);
  };

  const remove = (key: string) => {
    const targetIndex = panels.findIndex((panel) => panel.key === key);
    const nextPanels = panels.filter((panel) => panel.key !== key);
    setPanels(nextPanels);
    if (activeKey === key) {
      setActiveKey(nextPanels[Math.max(0, targetIndex - 1)]?.key ?? "");
    }
  };

  return (
    <Tabs
      value={activeKey}
      variant="browser"
      onChange={setActiveKey}
      onRemove={remove}
      extra={<Button icon={Plus} onClick={add} />}
    >
      {panels.map((panel) => (
        <TabPanel key={panel.key} title={panel.title} closable={panel.closable}>
          {panel.content}
        </TabPanel>
      ))}
    </Tabs>
  );
}
