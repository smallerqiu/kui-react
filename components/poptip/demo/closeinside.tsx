import { useState } from "react";
import { Button, Poptip } from "react-kui";

export default function CloseInside() {
  const [show, setShow] = useState(false);
  return (
    <Poptip
      title="Title"
      trigger="click"
      show={show}
      onShowChange={setShow}
      content={
        <Button onClick={() => setShow(false)} size="small">
          Close
        </Button>
      }
    >
      <Button type="primary">Click me</Button>
    </Poptip>
  );
}
