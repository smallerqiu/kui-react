import { PanelLeftClose, PanelLeftOpen } from "kui-icons";
import { useState } from "react";
import { Button, Menu } from "react-kui";
import { items } from "./data";
export default function Collapsed() {
  const [collapsed, setCollapsed] = useState(false),
    [current, setCurrent] = useState(["1-1"]),
    [openKeys, setOpenKeys] = useState(["sub2"]);
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
