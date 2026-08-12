import { LogoApple } from "kui-icons";
import { useState } from "react";
import { Space, RadioGroup } from "react-kui";
import type { DirectionType, RadioType, ShapeType, SizeType, ThemeType } from "react-kui";
const dates = [
    { label: "1 week", value: 0 },
    { label: "1 month", value: 1 },
    { label: "Q1", value: 2 },
    { label: "1 year", value: 3 },
    { label: "5 years", value: 4, disabled: true },
  ],
  sizes = [
    { label: "Large", value: "large", icon: LogoApple },
    { label: "Medium", value: "medium" },
    { label: "Small", value: "small" },
  ],
  directions = [
    { label: "Horizontal", value: "horizontal" },
    { label: "Vertical", value: "vertical" },
  ],
  types = [
    { label: "Radio", value: "radio" },
    { label: "Button", value: "button" },
  ],
  shapes = [
    { label: "Round", value: "round" },
    { label: "Circle", value: "circle" },
    { label: "Square", value: "square" },
  ],
  themes = [
    { label: "Default", value: "default" },
    { label: "Fill", value: "fill" },
    { label: "Card", value: "card" },
    { label: "Outline", value: "outline" },
  ];
export default function App() {
  const [size, setSize] = useState<SizeType>("medium"),
    [shape, setShape] = useState<ShapeType>("round"),
    [theme, setTheme] = useState<ThemeType>("default"),
    [direction, setDirection] = useState<DirectionType>("horizontal"),
    [type, setType] = useState<RadioType>("button"),
    [value, setValue] = useState(0);
  return (
    <Space vertical>
      <RadioGroup value={shape} size="small" type="button" options={shapes} onChange={setShape} />
      <RadioGroup value={theme} size="small" type="button" options={themes} onChange={setTheme} />
      <RadioGroup value={size} type="button" size="small" options={sizes} onChange={setSize} />
      <RadioGroup
        value={direction}
        type="button"
        size="small"
        options={directions}
        onChange={setDirection}
      />
      <RadioGroup value={type} type="button" size="small" options={types} onChange={setType} />
      <br />
      <RadioGroup
        value={value}
        onChange={setValue}
        size={size}
        theme={theme}
        shape={shape}
        options={dates}
        direction={direction}
        type={type}
      />
    </Space>
  );
}
