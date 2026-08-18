import { Button, Tour } from "react-kui";
import { useRef, useState } from "react";
export default function App() {
  const target = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  return (
    <>
      <Button ref={target} onClick={() => setOpen(true)}>
        开始
      </Button>
      <Tour
        open={open}
        current={current}
        onChange={setCurrent}
        onOpenChange={setOpen}
        steps={[{ target: () => target.current, title: "受控引导", description: "状态由外部管理" }]}
      />
    </>
  );
}
