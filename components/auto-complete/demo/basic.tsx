import { AutoComplete } from "react-kui";
import { useState } from "react";
export default function App() {
  const [value, setValue] = useState("");
  return (
    <AutoComplete
      value={value}
      onChange={setValue}
      clearable
      placeholder="Please input"
      options={["Vue", "React", "Solid", "Svelte"]}
    />
  );
}
