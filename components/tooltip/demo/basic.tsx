import { useState } from "react";
import { Space, Tooltip } from "react-kui";
export default function App() {
  const [clicked, setClicked] = useState(false);
  return (
    <Space vertical>
      <Tooltip title="How to behave?">
        <a href="#">Hover me</a>
      </Tooltip>
      <Tooltip title={clicked ? "How are you?" : "I'm fine!"}>
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            setClicked((value) => !value);
          }}
        >
          Click me!
        </a>
      </Tooltip>
      <Tooltip title="Default show" open>
        <a href="#">Default show</a>
      </Tooltip>
    </Space>
  );
}
