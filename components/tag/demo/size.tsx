import { useState } from "react";
import { RadioGroup, Space, Tag } from "react-kui";
const sizes = [
    { label: "Large", value: "large" },
    { label: "Medium", value: "medium" },
    { label: "Small", value: "small" },
  ],
  shapes = [
    { label: "Circle", value: "circle" },
    { label: "Square", value: "square" },
  ],
  themes = [
    { label: "Fill", value: "fill" },
    { label: "Outline", value: "outline" },
  ];
export default function Size() {
  const [size, setSize] = useState<any>("small"),
    [shape, setShape] = useState<any>("circle"),
    [theme, setTheme] = useState<any>("fill");
  return (
    <Space vertical>
      <RadioGroup value={size} type="button" options={sizes} onChange={setSize} />
      <RadioGroup value={shape} type="button" options={shapes} onChange={setShape} />
      <RadioGroup value={theme} type="button" options={themes} onChange={setTheme} />
      {[1, 2, 3].map((x) => (
        <Tag key={x} size={size} shape={shape} theme={theme}>
          Tag{x}
        </Tag>
      ))}
    </Space>
  );
}
