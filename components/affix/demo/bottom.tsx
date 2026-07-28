import { useState } from "react";
import { Button, Affix } from "react-kui";
export default function App() {
  const [bottom, setBottom] = useState(120);
  return (
    <Affix offsetBottom={bottom}>
      <Button type="primary" onClick={() => setBottom((x) => x + 10)}>
        {bottom}px to affix bottom
      </Button>
    </Affix>
  );
}
