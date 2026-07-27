import { useState } from "react";
import { Button } from "../../button";
import Space from "../../space";
import ColorPicker from "../index";
export default function CustomTrigger() {
  const [color1, setColor1] = useState("#3a95ff"),
    [color2, setColor2] = useState("red");
  return (
    <Space className="demo-color-picker" vertical>
      <Space>
        <ColorPicker value={color1} onChange={setColor1}>
          <Button type="primary">Open</Button>
        </ColorPicker>
        {color1}
      </Space>
      <Space>
        <ColorPicker value={color2} onChange={setColor2} trigger="hover">
          <Button type="primary">Hover</Button>
        </ColorPicker>
        {color2}
      </Space>
    </Space>
  );
}
