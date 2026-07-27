import { useState } from "react";
import Switch from "../../switch";
import Menu from "../index";
import { items } from "./data";
export default function Theme() {
  const [dark, setDark] = useState(true),
    [current, setCurrent] = useState(["1-1"]),
    [openKeys, setOpenKeys] = useState(["sub2"]);
  return (
    <div style={{ width: 256 }}>
      <Switch trueText="dark" falseText="light" checked={dark} onChange={setDark} />
      <br />
      <br />
      <Menu
        value={current}
        onSelect={({ key }) => setCurrent([key])}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        theme={dark ? "dark" : "light"}
        mode="inline"
        items={items}
      />
    </div>
  );
}
