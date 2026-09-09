import React, { useState } from "react";
import { Segmented } from "react-kui";

export default function SegmentedBasicDemo() {
  const [value, setValue] = useState("daily");
  return <Segmented value={value} onChange={(next) => setValue(String(next))} options={[
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
  ]} />;
}
