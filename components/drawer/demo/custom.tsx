import { useState } from "react";
import { Button } from "../../button";
import { Radio, RadioGroup } from "../../radio";
import Space from "../../space";
import Drawer, { type DrawerPlacementsType } from "../index";
const placements: DrawerPlacementsType[] = ["left", "top", "right", "bottom"];
export default function Custom() {
  const [open, setOpen] = useState(false),
    [placement, setPlacement] = useState<DrawerPlacementsType>("left");
  return (
    <div>
      <Space wrap>
        <RadioGroup
          value={placement}
          theme="card"
          type="button"
          onChange={(v) => setPlacement(v as DrawerPlacementsType)}
        >
          {placements.map((v) => (
            <Radio key={v} label={v} value={v} />
          ))}
        </RadioGroup>
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
