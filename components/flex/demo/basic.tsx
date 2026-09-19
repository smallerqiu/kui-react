import { useState } from "react";
import { Flex, Radio, RadioGroup } from "react-kui";
export default function App() {
  const [direction, setDirectionl] = useState("horizontal");
  return (
    <Flex vertical size="medium">
      <RadioGroup value={direction} onChange={setDirectionl}>
        <Radio value="horizontal">horizontal</Radio>
        <Radio value="vertical">vertical</Radio>
      </RadioGroup>
      <Flex vertical={direction == "vertical"} style={{ width: "100%" }}>
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            style={{
              backgroundColor: `var(--kui-color-bg-${index % 2 ? 4 : 3})`,
              height: 40,
              width: direction == "vertical" ? "100%" : "25%",
            }}
          />
        ))}
      </Flex>
    </Flex>
  );
}
