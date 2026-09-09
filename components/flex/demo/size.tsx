import { useState } from "react";
import {
  Button,
  Checkbox,
  Flex,
  Radio,
  RadioGroup,
  Slider,
  type FlexSizeType,
  type SizeType,
} from "react-kui";

export default function App() {
  const [flexSize, setFlexSize] = useState<FlexSizeType>("small");
  const [custom, setCustom] = useState(false);
  const [customSize, setCustomSize] = useState(8);
  return (
    <Flex vertical size="medium">
      <RadioGroup value={flexSize} onChange={(value) => setFlexSize(value)}>
        {(["small", "medium", "large"] as SizeType[]).map((item) => (
          <Radio key={item} value={item} label={item[0].toUpperCase() + item.slice(1)} />
        ))}
      </RadioGroup>
      <Checkbox checked={custom} label="customize" onChange={({ checked }) => setCustom(checked)} />
      {custom && (
        <Slider
          value={customSize}
          max={50}
          step={1}
          onChange={(value) => {
            const next = value as number;
            setCustomSize(next);
            setFlexSize(next);
          }}
        />
      )}
      <Flex size={flexSize}>
        <Button type="primary">Primary</Button>
        <Button>Default</Button>
        <Button type="text">Text</Button>
        <Button type="link">Link</Button>
      </Flex>
    </Flex>
  );
}
