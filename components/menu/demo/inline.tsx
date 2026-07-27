import { useState } from "react";
import { Menu } from "react-kui";
import { inlineItems } from "./data";
export default function Inline() {
  const [current, setCurrent] = useState(["1-1"]),
    [openKeys, setOpenKeys] = useState(["sub1"]);
  return (
    <div style={{ width: 256 }}>
      <Menu
        value={current}
        onSelect={({ key }) => setCurrent([key])}
        openKeys={openKeys}
        mode="inline"
        onOpenChange={(keys) => {
          setOpenKeys(keys);
          console.log(keys);
        }}
        items={inlineItems}
      />
    </div>
  );
}
