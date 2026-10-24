import { useState } from "react";
import { AutoComplete, Button, Space } from "react-kui";
export default function App() {
  const [value, setValue] = useState("");
  return (
    <Space vertical block>
      <AutoComplete
        value={value}
        onChange={setValue}
        addonBefore="https://"
        addonAfter={<Button>OK</Button>}
        placeholder="Please input domain"
        options={["kui", "kui-pro", "kui-admin", "kui-docs"]}
      />
      <AutoComplete
        prefix="@"
        suffix=".cn"
        placeholder="Please input handle"
        options={["kui", "kui-pro", "kui-admin", "kui-docs"]}
      />
    </Space>
  );
}
