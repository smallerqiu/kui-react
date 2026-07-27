import { useState } from "react";
import { Button } from "../../button";
import Flex from "../index";
export default function Basic() {
  const [vertical, setVertical] = useState(false);
  return (
    <Flex vertical size="medium">
      <Flex size="small">
        <Button type={!vertical ? "primary" : "default"} onClick={() => setVertical(false)}>
          horizontal
        </Button>
        <Button type={vertical ? "primary" : "default"} onClick={() => setVertical(true)}>
          vertical
        </Button>
      </Flex>
      <Flex vertical={vertical} style={{ width: "100%" }}>
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            style={{
              backgroundColor: `var(--kui-color-bg-${index % 2 ? 4 : 3})`,
              height: 40,
              width: vertical ? "100%" : "25%",
            }}
          />
        ))}
      </Flex>
    </Flex>
  );
}
