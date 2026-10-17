import { useState } from "react";
import { RadioGroup, Space, Transfer } from "react-kui";
const items = ["Design", "Development", "Testing", "Deployment"].map((title, key) => ({
  key: key + 1,
  title,
}));
export default function App() {
  // The panels offer the five tiers they paint; `underlined` is a control tier and lands back on `outline`.
  const [theme, setTheme] = useState<"fill" | "outline" | "plain" | "solid" | "dashed">("outline");
  const [targetKeys, setTargetKeys] = useState<(string | number)[]>([4]);
  return (
    <Space vertical block>
      <RadioGroup
        type="button"
        options={[
          { label: "Outline", value: "outline" },
          { label: "Fill", value: "fill" },
          { label: "Plain", value: "plain" },
          { label: "Solid", value: "solid" },
          { label: "Dashed", value: "dashed" },
        ]}
        value={theme}
        onChange={(value) => setTheme(value as typeof theme)}
      />
      <Transfer
        targetKeys={targetKeys}
        onChange={(event) => setTargetKeys(event.targetKeys)}
        searchable
        theme={theme}
        dataSource={items}
      />
    </Space>
  );
}
