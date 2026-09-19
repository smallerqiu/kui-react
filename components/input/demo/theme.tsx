import { Search } from "kui-icons";
import { useState } from "react";
import { Checkbox, type ShapeType, message, Space, Input, TextArea } from "react-kui";
export default function App() {
  const [circle, setCircle] = useState(false);
  const shape: ShapeType | undefined = circle ? "circle" : undefined;
  const search = (value: string) => {
    message.info("This is search event");
    console.log(value);
  };
  return (
    <Space vertical block>
      <Checkbox checked={circle} label="Circle" onChange={(event) => setCircle(event.checked)} />
      <Input placeholder="Please input" shape={shape} />
      <Input placeholder="Disabled" disabled shape={shape} />
      <Input placeholder="Please input" icon={Search} shape={shape} />
      <Input placeholder="theme='outline'" theme="outline" shape={shape} />
      <Input placeholder="Please input" clearable={false} shape={shape} onSearch={search} />
      <TextArea placeholder="Please input" rows={3} />
    </Space>
  );
}
