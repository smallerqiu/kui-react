import { useRef, useState } from "react";
import { Button, Space, Tour } from "react-kui";

export default function App() {
  const leftTarget = useRef<HTMLButtonElement>(null);
  const rightTarget = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Space>
        <Button ref={leftTarget}>左侧目标</Button>
        <Button ref={rightTarget}>右侧目标</Button>
        <Button type="primary" onClick={() => setOpen(true)}>
          查看定位
        </Button>
      </Space>
      <Tour
        open={open}
        onOpenChange={setOpen}
        steps={[
          {
            target: () => leftTarget.current,
            title: "底部",
            description: "默认显示在目标底部。",
          },
          {
            target: () => rightTarget.current,
            title: "左侧",
            description: "空间不足时可调整方向。",
            placement: "left",
          },
        ]}
      />
    </>
  );
}
