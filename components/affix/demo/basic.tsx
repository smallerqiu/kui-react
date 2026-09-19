import { useState } from "react";
import { Button, Affix } from "react-kui";
export default function App() {
  const [top, setTop] = useState(100);
  return (
    <Affix offsetTop={top}>
      <Button type="primary" onClick={() => setTop((x) => x + 10)}>
        Affix top ({top}px)
      </Button>
    </Affix>
  );
}
