import { Button, Space, Tour } from "react-kui";
import { useRef, useState } from "react";
export default function App() {
  const top = useRef<HTMLButtonElement>(null);
  const right = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Space>
        <Button ref={top}>顶部</Button>
        <Button ref={right}>右侧</Button>
        <Button onClick={() => setOpen(true)}>开始</Button>
      </Space>
      <Tour
        open={open}
        onOpenChange={setOpen}
        steps={[
          { target: () => top.current, placement: "top", title: "顶部" },
          { target: () => right.current, placement: "right", title: "右侧" },
        ]}
      />
    </>
  );
}
