import { Button, Tour } from "react-kui";
import { useRef, useState } from "react";
export default function App() {
  const target = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button ref={target} onClick={() => setOpen(true)}>
        无蒙层引导
      </Button>
      <Tour
        open={open}
        mask={false}
        onOpenChange={setOpen}
        steps={[{ target: () => target.current, title: "无蒙层", description: "页面内容保持可见" }]}
      />
    </>
  );
}
