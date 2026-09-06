import { Button, InputTag, Space } from "react-kui";
import { useState } from "react";
export default function App() {
  const [tags, setTags] = useState(["Design", "TypeScript"]);
  return (
    <Space vertical>
      <code>{tags.join(" / ")}</code>
      <InputTag value={tags} onChange={setTags} />
      <Button size="small" onClick={() => setTags(["Design", "TypeScript"])}>
        重置
      </Button>
    </Space>
  );
}
