import { Search } from "kui-icons";
import { useState } from "react";
import { Checkbox } from "../../checkbox";
import type { ShapeType } from "../../const/types";
import message from "../../message";
import Space from "../../space";
import { Input, TextArea } from "../index";
export default function Theme() {
  const [circle, setCircle] = useState(false);
  const shape: ShapeType | undefined = circle ? "circle" : undefined;
  const search = (value: string) => {
    message.info("This is search event");
    console.log(value);
  };
  return (
    <Space vertical block>
      <Checkbox checked={circle} label="Circle" onChange={setCircle} />
      <Input placeholder="Please input" shape={shape} />
      <Input placeholder="Disabled" disabled shape={shape} />
      <Input placeholder="Please input" icon={Search} shape={shape} />
      <Input placeholder="theme='outline'" theme="outline" shape={shape} />
      <Input placeholder="Please input" clearable={false} shape={shape} onSearch={search} />
      <TextArea placeholder="Please input" rows={3} />
    </Space>
  );
}
