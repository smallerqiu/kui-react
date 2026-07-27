import { useRef } from "react";
import { Button } from "../../button";
import message from "../index";
export default function Loading() {
  const count = useRef(0);
  return (
    <Button
      type="primary"
      onClick={() => {
        const hide = message.loading(
          `Processing submitted data, please wait...${++count.current}`,
          0
        );
        setTimeout(hide, 3500);
      }}
    >
      Display a loading indicator
    </Button>
  );
}
