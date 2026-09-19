import { useState } from "react";
import { Select } from "react-kui";

const options = Array.from({ length: 10000 }, (_, index) => ({
  value: index + 1,
  label: `Option ${index + 1}`,
}));
export default function App() {
  const [value, setValue] = useState<string | number>();
  return (
    <Select
      value={value}
      onChange={(next) =>
        setValue(typeof next === "string" || typeof next === "number" ? next : undefined)
      }
      virtual
      filterable
      block
      options={options}
      itemHeight={33}
      overscan={6}
      placeholder="Select from 10,000 options"
    />
  );
}
