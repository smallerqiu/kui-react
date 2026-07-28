import { useState } from "react";
import { Button, Flex, Slider } from "react-kui";

export default function App() {
  const [x, setX] = useState(12);
  const [y, setY] = useState(15);
  return (
    <Flex size="medium" vertical align="flex-start" style={{ maxWidth: 300 }}>
      <Slider value={x} min={0} max={100} step={1} onChange={(value) => setX(value as number)} />
      <Slider value={y} min={0} max={100} step={1} onChange={(value) => setY(value as number)} />
      <Flex size={[x, y]} wrap>
        {Array.from({ length: 10 }, (_, index) => (
          <Button size="small" key={index}>
            Wrap
          </Button>
        ))}
      </Flex>
    </Flex>
  );
}
