import { useRef } from "react";
import { Button, notice } from "react-kui";

export default function App() {
  const count = useRef(0);
  return (
    <Button
      type="primary"
      onClick={() => {
        count.current += 1;
        notice.info({
          title: "Task Progress",
          content: `Processed ${count.current} batch${count.current > 1 ? "es" : ""}.`,
          grouping: "task-batch",
        });
      }}
    >
      Update Notice
    </Button>
  );
}
