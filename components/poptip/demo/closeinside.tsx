import { useState } from "react";
import { Button, Poptip } from "react-kui";

export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <Poptip
      title="Title"
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      content={
        <Button onClick={() => setOpen(false)} size="small">
          Close
        </Button>
      }
    >
      <Button type="primary">Click me</Button>
    </Poptip>
  );
}
