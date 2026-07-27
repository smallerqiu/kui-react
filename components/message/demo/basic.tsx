import { useRef } from "react";
import { Button } from "../../button";
import message from "../index";
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
