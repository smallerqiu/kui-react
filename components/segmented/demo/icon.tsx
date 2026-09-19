import { Monitor, Smartphone, Tablet } from "kui-icons";
import { useState } from "react";
import { Segmented } from "react-kui";

const options = [
  { label: "Desktop", value: "desktop", icon: Monitor },
  { label: "Tablet", value: "tablet", icon: Tablet },
  { label: "Mobile", value: "mobile", icon: Smartphone },
];

export default function SegmentedIconDemo() {
  const [device, setDevice] = useState("desktop");
  return <Segmented value={device} options={options} onChange={(value) => setDevice(String(value))} />;
}
