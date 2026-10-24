import { AutoComplete } from "react-kui";
import { useState } from "react";
export default function App() {
  const [value, setValue] = useState("");
  return (
    <AutoComplete
      value={value}
      onChange={setValue}
      addonBefore="https://"
      addonAfter=".com"
      placeholder="Please input domain"
      options={["kui", "kui-pro", "kui-admin", "kui-docs"]}
    />
  );
}
