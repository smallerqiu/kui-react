import { useState } from "react";
import { Menu } from "react-kui";
import { inlineItems } from "./data";
export default function Accordion() {
  const [current, setCurrent] = useState(["1-1"]),
    [openKeys, setOpenKeys] = useState(["sub1"]);
  return (
    <div style={{ width: 256 }}>
      <Menu
        value={current}
        onSelect={({ key }) => setCurrent([key])}
        openKeys={openKeys}
        onOpenChange={(keys) => {
          setOpenKeys(keys);
          console.log(keys);
        }}
        accordion
        mode="inline"
        items={inlineItems}
      />
    </div>
  );
}
