import { Button, Space, AutoComplete } from "react-kui";
import { useState } from "react";
export default function App() {
  const [value, setValue] = useState("");
  const options = ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Hangzhou"];
  return (
    <Space vertical>
      <code>value: {value || "-"}</code>
      <AutoComplete
        value={value}
        onChange={setValue}
        options={options}
        placeholder="Please choose city"
      />
      <Button size="small" onClick={() => setValue("Shenzhen")}>
        Shenzhen
      </Button>
    </Space>
  );
}
