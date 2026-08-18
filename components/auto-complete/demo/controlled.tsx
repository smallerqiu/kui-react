import { Button, Space, AutoComplete } from "react-kui";
import { useState } from "react";
export default function App() {
  const [value, setValue] = useState("React");
  return (
    <Space vertical>
      <AutoComplete value={value} onChange={setValue} options={["React", "Vue", "Solid"]} />
      <Button onClick={() => setValue("Vue")}>设为 Vue</Button>
    </Space>
  );
}
