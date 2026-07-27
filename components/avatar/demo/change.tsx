import { useState } from "react";
import { Button, Space, Avatar } from "react-kui";

const userList = ["K", "Zhang", "Mr Qiu", "Jack cheng", "Jone Blue"];
const colorList = ["#3a95ff", "#00bb5d", "#ff3300", "#ffa500"];
const randomIndex = (length: number) => Math.floor(Math.random() * length);

export default function Change() {
  const [text, setText] = useState(userList[0]);
  const [color, setColor] = useState(colorList[0]);
  const changeValue = () => {
    setText(userList[randomIndex(userList.length)]);
    setColor(colorList[randomIndex(colorList.length)]);
  };
  return (
    <Space>
      <Avatar size="large" style={{ backgroundColor: color, verticalAlign: "middle" }}>
        {text}
      </Avatar>
      <Button size="small" onClick={changeValue}>
        change
      </Button>
    </Space>
  );
}
