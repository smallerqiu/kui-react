import { useRef } from "react";
import { Button, message } from "react-kui";
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
