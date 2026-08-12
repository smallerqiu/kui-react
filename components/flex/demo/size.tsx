import { useState } from "react";
import {
  Button,
  Checkbox,
  Flex,
  type FlexSizeType,
  Radio,
  RadioGroup,
  Slider,
  type SizeType,
} from "react-kui";

export default function App() {
  const [size, setSize] = useState<FlexSizeType>("small");
  const [custom, setCustom] = useState(false);
  const [customSize, setCustomSize] = useState(8);
  return (
    <Flex vertical size="medium">
      <RadioGroup
        value={Array.isArray(size) ? "small" : size}
        onChange={(value) => setSize(value as SizeType)}
      >
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
            setSize(next);
          }}
        />
      )}
      <Flex size={size}>
        <Button type="primary">Primary</Button>
        <Button>Default</Button>
        <Button type="text">Text</Button>
        <Button type="link">Link</Button>
      </Flex>
    </Flex>
  );
}
