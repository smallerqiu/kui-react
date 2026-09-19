import { useRef, useState } from "react";
import { Button, Space, Tour } from "react-kui";
export default function App() {
  const first = useRef<HTMLButtonElement>(null);
  const second = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Space>
        <Button ref={first}>创建项目</Button>
        <Button ref={second}>发布</Button>
        <Button onClick={() => setOpen(true)}>开始引导</Button>
      </Space>
      <Tour
        open={open}
        onOpenChange={setOpen}
        steps={[
          { target: () => first.current, title: "创建", description: "从这里建立一个新项目。" },
          {
            target: () => second.current,
            title: "发布",
            description: "准备好以后将内容发布。",
            placement: "left",
          },
        ]}
      />
    </>
  );
}
