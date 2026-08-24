import { Heart, Mail, PanelLeftClose, PanelLeftOpen, Settings, Table } from "kui-icons";
import { useState } from "react";
import { Button, Menu, type MenuOptionsProps } from "react-kui";
const items: MenuOptionsProps[] = [
  { title: "Option 1", key: "1-1", icon: Mail },
  { title: "Option 2", key: "2-1", icon: Table },
  {
    title: "Navigation Two",
    key: "3-1",
    icon: Heart,
    children: [
      { title: "Option 5", key: "3-1-1", icon: Mail },
      { title: "Option 6", key: "3-1-2", icon: Mail },
      {
        title: "SubMenu",
        key: "3-1-3",
        icon: Mail,
        children: [
          { title: "Option 7", key: "3-1-3-1", icon: Mail },
          { title: "Option 8", key: "3-1-3-2", icon: Mail },
        ],
      },
    ],
  },
  {
    title: "Navigation Three",
    key: "4-1",
    icon: Settings,
    children: [
      { title: "Option 9", key: "4-1-1", icon: Mail },
      { title: "Option 10", key: "4-1-2", icon: Mail },
      { title: "Option 11", key: "4-1-3", icon: Mail },
      { title: "Option 12", key: "4-1-4", icon: Mail },
    ],
  },
];
export default function App() {
  const [collapsed, setCollapsed] = useState(false),
    [current, setCurrent] = useState(["1-1"]),
    [openKeys, setOpenKeys] = useState(["3-1"]);
  return (
    <div style={{ width: 256 }}>
      <Button
        onClick={() => setCollapsed(!collapsed)}
        icon={collapsed ? PanelLeftOpen : PanelLeftClose}
        type="primary"
      />
      <br />
      <br />
      <Menu
        value={current}
        onSelect={({ key }) => setCurrent([key])}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        theme="dark"
        inlineCollapsed={collapsed}
        mode="inline"
        items={items}
      />
    </div>
  );
}
