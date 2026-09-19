import { useState } from "react";
import {
  Button,
  Drawer,
  Segmented,
  Space,
  type DrawerPlacementsType,
} from "react-kui";
const placements: DrawerPlacementsType[] = ["left", "top", "right", "bottom"];
export default function App() {
  const [open, setOpen] = useState(false),
    [placement, setPlacement] = useState<DrawerPlacementsType>("left");
  return (
    <div>
      <Space wrap>
        <Segmented
          value={placement}
          options={placements.map((value) => ({ label: value, value }))}
          onChange={(v) => setPlacement(v as DrawerPlacementsType)}
        />
        <Button onClick={() => setOpen(true)}>Open</Button>
      </Space>
      <Drawer
        open={open}
        height={300}
        placement={placement}
        title="What's your name?"
        cancelText="Cancel"
        okText="Ok"
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
      >
        My name is Qiu.
      </Drawer>
    </div>
  );
}
