import { useState } from "react";
import { Tooltip } from "react-kui";
export default function Basic() {
  const [clicked, setClicked] = useState(false);
  return (
    <>
      <Tooltip title="How to behave?">
        <a href="#">Hover me</a>
      </Tooltip>
      <br />
      <br />
      <br />
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
    </>
  );
}
