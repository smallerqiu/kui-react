import { Plus } from "kui-icons";
import { useState } from "react";
import { Button } from "../../button";
import { TabPanel, Tabs } from "../index";
interface Pane {
  key: string;
  title: string;
  content: string;
  closable?: boolean;
}
const initial: Pane[] = [
  { key: "1", title: "Tab 1", content: "Content 1" },
  { key: "2", title: "Tab 2", content: "Content 2", closable: true },
  { key: "3", title: "Tab 3", content: "Content 3", closable: true },
];
export default function Closable() {
  const [panes, setPanes] = useState(initial);
  const [active, setActive] = useState("1");
  const [index, setIndex] = useState(0);
  const add = () => {
    const next = index + 1,
      key = `A${next}`;
    setIndex(next);
    setPanes((x) => [
      ...x,
      { key, title: `New Tab ${next}`, content: `Content of new Tab ${next}`, closable: true },
    ]);
    setActive(key);
  };
  const remove = (key: string) => {
    const at = panes.findIndex((x) => x.key === key);
    const next = panes.filter((x) => x.key !== key);
    setPanes(next);
    if (active === key) setActive(next[Math.max(0, at - 1)]?.key ?? "");
  };
  return (
    <Tabs
      value={active}
      onChange={setActive}
      card
      onRemove={remove}
      extra={<Button icon={Plus} size="small" onClick={add} />}
    >
      {panes.map((x) => (
        <TabPanel key={x.key} title={x.title} closable={x.closable}>
          {x.content}
        </TabPanel>
      ))}
    </Tabs>
  );
}
