import { InputTag } from "react-kui";
import { useState } from "react";
export default function App() {
  const [value, setValue] = useState(["React"]);
  return <InputTag value={value} onChange={setValue} placeholder="受控标签" />;
}
