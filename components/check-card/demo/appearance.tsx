import { useState } from "react";
import { CheckCardGroup } from "react-kui";

const items = [
  { value: "basic", title: "Basic", description: "Essential features" },
  { value: "pro", title: "Pro", description: "Advanced capabilities" },
];

export default function App() {
  const [outline, setOutline] = useState("basic");
  const [fill, setFill] = useState("pro");
  const [disabled, setDisabled] = useState("basic");
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <CheckCardGroup
        value={outline}
        onChange={(next) => setOutline(String(next))}
        theme="outline"
        shape="square"
        size="small"
        options={items}
      />
      <CheckCardGroup
        value={fill}
        onChange={(next) => setFill(String(next))}
        theme="fill"
        shape="circle"
        size="large"
        options={items}
      />
      <CheckCardGroup
        value={disabled}
        onChange={(next) => setDisabled(String(next))}
        disabled
        options={items}
      />
    </div>
  );
}
