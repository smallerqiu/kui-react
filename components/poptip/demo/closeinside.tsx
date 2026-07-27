import { useState } from "react";
import { Button } from "../../button";
import Poptip from "../index";

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
