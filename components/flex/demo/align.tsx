import { useState } from "react";
import {
  Button,
  Flex,
  RadioButton,
  RadioGroup,
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
      <RadioGroup value={justify} theme="card" type="button" onChange={setJustify}>
        {justifyOptions.map((item) => (
          <RadioButton key={item} value={item}>
            {item}
          </RadioButton>
        ))}
      </RadioGroup>
      <span>Align</span>
      <RadioGroup value={align} theme="card" type="button" onChange={setAlign}>
        {alignOptions.map((item) => (
          <RadioButton key={item} value={item}>
            {item}
          </RadioButton>
        ))}
      </RadioGroup>
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
        {Array.from({ length: 4 }, (_, index) => (
          <Button key={index}>Button</Button>
        ))}
      </Flex>
    </Flex>
  );
}
