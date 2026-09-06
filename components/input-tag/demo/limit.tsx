import { useState } from "react";
import { InputTag, Space } from "react-kui";
export default function App() {
  const [tags, setTags] = useState(["Design", "Develop"]);
  return (
    <Space vertical>
      <code>已输入 {tags.length} / 3</code>
      <InputTag value={tags} onChange={setTags} max={3} placeholder="最多输入 3 项" />
      <InputTag
        defaultValue={["Design", "Develop", "Test", "Release"]}
        maxTagCount={2}
        clearable
        placeholder="最多展示 2 项"
      />
    </Space>
  );
}
