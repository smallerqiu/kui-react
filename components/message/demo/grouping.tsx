import { useRef } from "react";
import { Button, message } from "react-kui";

export default function App() {
  const count = useRef(0);
  return (
    <Button
      type="primary"
      onClick={() => {
        count.current += 1;
        message.show({
          type: "info",
          content: `this is a base message number: ${count.current}`,
          grouping: "task-batch",
        });
      }}
    >
      Click Me
    </Button>
  );
}
