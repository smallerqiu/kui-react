import { Heart, Mail, Settings, Table } from "kui-icons";
import { useState } from "react";
import { Button, type DirectionType, Space, Menu, type MenuOptionsProps } from "react-kui";
const items: MenuOptionsProps[] = [
  { key: "1-1", icon: Mail, title: "Option 1" },
  { key: "1-2", icon: Table, title: "Option 2" },
  {
    key: "sub2",
    icon: Heart,
    title: "Navigation Two",
    children: [
      { key: "2-1", title: "Option 5" },
      { key: "2-2", title: "Option 6" },
      {
        key: "sub2-1",
        title: "SubMenu",
        children: [
          { key: "2-3", title: "Option 7" },
          { key: "2-4", title: "Option 8" },
        ],
      },
    ],
  },
  {
    key: "sub3",
    icon: Settings,
    title: "Navigation Three",
    children: [
      { key: "3-1", title: "Option 9" },
      { key: "3-2", title: "Option 10" },
      { key: "3-3", title: "Option 11" },
      { key: "3-4", title: "Option 12" },
    ],
  },
];
export default function App() {
  const [current, setCurrent] = useState(["1-1"]),
    [openKeys, setOpenKeys] = useState(["sub2"]),
    [mode, setMode] = useState<DirectionType>("inline"),
    [dark, setDark] = useState(false);
  return (
    <div>
      <Space>
        <Button onClick={() => setMode(mode === "inline" ? "vertical" : "inline")}>
          Change Mode
        </Button>
        <Button onClick={() => setDark(!dark)}>Change Theme</Button>
      </Space>
      <br />
      <br />
      <Menu
        value={current}
        onSelect={({ key }) => setCurrent([key])}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        theme={dark ? "dark" : "light"}
        mode={mode}
        style={{ width: 256 }}
        items={items}
      />
    </div>
  );
}
