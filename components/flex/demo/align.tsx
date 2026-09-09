import { useState } from "react";
import {
  Button,
  Flex,
  Segmented,
  type FlexAlignType,
  type FlexJustifyType,
} from "react-kui";
const justifyOptions: FlexJustifyType[] = [
  "flex-start",
  "center",
  "flex-end",
  "space-between",
  "space-around",
  "space-evenly",
];
const alignOptions: FlexAlignType[] = ["flex-start", "center", "flex-end"];
export default function App() {
  const [justify, setJustify] = useState<FlexJustifyType>("flex-start");
  const [align, setAlign] = useState<FlexAlignType>("flex-start");
  return (
    <Flex vertical size="small" align="start">
      <span>Justify</span>
      <Segmented value={justify} options={justifyOptions.map((value) => ({ label: value, value }))} onChange={(value) => setJustify(value as FlexJustifyType)} />
      <span>Align</span>
      <Segmented value={align} options={alignOptions.map((value) => ({ label: value, value }))} onChange={(value) => setAlign(value as FlexAlignType)} />
      <Flex
        align={align}
        justify={justify}
        style={{
          width: "100%",
          height: 120,
          border: "1px solid var(--kui-color-bg-2)",
          borderRadius: 5,
        }}
      >
        {Array.from({ length: 3 }, (_, index) => (
          <Button key={index}>Button</Button>
        ))}
      </Flex>
    </Flex>
  );
}
