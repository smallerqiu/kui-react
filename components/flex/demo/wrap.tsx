import { useState } from "react";
import { Button } from "../../button";
import Flex from "../index";
export default function Wrap() {
  const [x, setX] = useState(12);
  const [y, setY] = useState(15);
  return (
    <Flex size="medium" vertical align="flex-start" style={{ maxWidth: 300 }}>
      <label>
        Horizontal gap: {x}
        <input
          type="range"
          min={0}
          max={100}
          value={x}
          onChange={(event) => setX(Number(event.target.value))}
        />
      </label>
      <label>
        Vertical gap: {y}
        <input
          type="range"
          min={0}
          max={100}
          value={y}
          onChange={(event) => setY(Number(event.target.value))}
        />
      </label>
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
