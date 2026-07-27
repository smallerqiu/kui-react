import { useRef, useState } from "react";
import { Button, RadioGroup, Space, Drawer, type DrawerPlacementsType } from "react-kui";
const options = ["left", "top", "right", "bottom"].map((value) => ({ label: value, value }));
export default function Target() {
  const [open, setOpen] = useState(false),
    [placement, setPlacement] = useState<DrawerPlacementsType>("left"),
    ref = useRef<HTMLDivElement>(null);
  return (
    <>
      <Space wrap>
        <RadioGroup
          value={placement}
          options={options}
          type="button"
          theme="card"
          onChange={(v) => setPlacement(v as DrawerPlacementsType)}
        />
        <Button onClick={() => setOpen((v) => !v)}>Open</Button>
      </Space>
      <br />
      <br />
      <div
        ref={ref}
        style={{
          height: 300,
          position: "relative",
          overflow: "hidden",
          borderRadius: 8,
          background: "rgba(130, 130, 130, 0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#999" }}>Drawer inside with target.</p>
      </div>
      <Drawer
        open={open}
        width="50%"
        height="50%"
        footer={false}
        placement={placement}
        target={() => ref.current ?? document.body}
        onClose={() => setOpen(false)}
      >
        <p>something ...</p>
        <p>something ...</p>
        <p>something ...</p>
      </Drawer>
    </>
  );
}
