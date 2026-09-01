import { useState } from "react";
import { Button, Space, Tour } from "react-kui";

export default function App() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const steps = [
    { title: "欢迎", description: "Tour 也可以不绑定页面目标。" },
    { title: "受控步骤", description: "current 与 change 由业务状态管理。" },
    { title: "完成", description: "完成后将步骤重置。" },
  ];

  return (
    <>
      <Space vertical>
        <Button onClick={() => setOpen(true)}>从当前步骤开始</Button>
        <span>当前步骤：{current + 1}</span>
      </Space>
      <Tour
        open={open}
        current={current}
        onChange={setCurrent}
        onOpenChange={setOpen}
        onFinish={() => setCurrent(0)}
        steps={steps}
      />
    </>
  );
}
