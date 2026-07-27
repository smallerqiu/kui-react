import { useRef } from "react";
import { Button, message } from "react-kui";
export default function Basic() {
  const count = useRef(0);
  return (
    <Button
      type="primary"
      onClick={() => message.info(`this is a base message number : ${++count.current}`)}
    >
      Show base info
    </Button>
  );
}
