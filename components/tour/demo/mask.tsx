import { useState } from "react";
import { Button, Tour } from "react-kui";

export default function App() {
  const [open, setOpen] = useState(false);
  const steps = [
    { title: "无遮罩模式", description: "适合不希望打断用户当前操作的轻量提示。" },
    { title: "继续浏览", description: "背景内容保持可见。" },
  ];

  return (
    <>
      <Button onClick={() => setOpen(true)}>无遮罩引导</Button>
      <Tour open={open} mask={false} onOpenChange={setOpen} steps={steps} />
    </>
  );
}
