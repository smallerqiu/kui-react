import { useState } from "react";
import { Button } from "../../button";
import Affix from "../index";
export default function Bottom() {
  const [bottom, setBottom] = useState(120);
  return (
    <Affix offsetBottom={bottom}>
      <Button type="primary" onClick={() => setBottom((x) => x + 10)}>
        {bottom}px to affix bottom
      </Button>
    </Affix>
  );
}
