import { useState } from "react";
import { Button } from "../../button";
import Affix from "../index";
export default function Basic() {
  const [top, setTop] = useState(100);
  return (
    <Affix offsetTop={top}>
      <Button type="primary" onClick={() => setTop((x) => x + 10)}>
        Affix top ({top}px)
      </Button>
    </Affix>
  );
}
