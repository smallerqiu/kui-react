import React, { useState } from "react";
import { Segmented, Space } from "react-kui";

export default function SegmentedOptionsDemo() {
  const [value, setValue] = useState("react");
  const options = [
    { label: "Vue", value: "vue" },
    { label: "React", value: "react" },
    { label: "Disabled", value: "disabled", disabled: true },
  ];
  return <Space direction="vertical">
    <Segmented value={value} onChange={(next) => setValue(String(next))} options={options} size="small" />
    <Segmented value={value} onChange={(next) => setValue(String(next))} options={options} block />
    <Segmented value={value} onChange={(next) => setValue(String(next))} options={options} direction="vertical" />
  </Space>;
}
