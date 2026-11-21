import { Monitor, Smartphone, Tablet, List, LayoutGrid } from "kui-icons";
import { useState } from "react";
import { Segmented, Space } from "react-kui";

const options = [
  { label: "Desktop", value: "desktop", icon: Monitor },
  { label: "Tablet", value: "tablet", icon: Tablet },
  { label: "Mobile", value: "mobile", icon: Smartphone },
];

export default function SegmentedIconDemo() {
  const [device, setDevice] = useState("desktop");
  const [layout, setLayout] = useState("list");
  return (
    <Space vertical>
      <Segmented value={device} options={options} onChange={(value) => setDevice(String(value))} />
      <Segmented
        value={layout}
        options={[
          { value: "list", icon: List },
          { value: "grid", icon: LayoutGrid },
        ]}
        onChange={(value) => setLayout(String(value))}
        aria-label="Layout"
      />
    </Space>
  );
}
