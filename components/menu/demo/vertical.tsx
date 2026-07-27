import { useState } from "react";
import Menu from "../index";
import { items } from "./data";
export default function Vertical() {
  const [current, setCurrent] = useState(["1-1"]);
  return (
    <div style={{ width: 256 }}>
      <Menu
        value={current}
        onSelect={({ key }) => setCurrent([key])}
        mode="vertical"
        items={items}
      />
    </div>
  );
}
