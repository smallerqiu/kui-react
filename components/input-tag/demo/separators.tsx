import { useState } from "react";
import { InputTag } from "react-kui";
export default function App() {
  const [tags, setTags] = useState<string[]>([]);
  return (
    <InputTag
      value={tags}
      onChange={setTags}
      separators={[",", ";"]}
      placeholder="使用逗号或分号创建标签"
    />
  );
}
