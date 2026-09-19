import { useState } from "react";
import { InputOTP, Space } from "react-kui";

export default function App() {
  const [numberValue, setNumberValue] = useState("");
  const [letterValue, setLetterValue] = useState("");
  return (
    <Space vertical size="large">
      <div>
        <p>Any character</p>
        <InputOTP value={letterValue} onChange={setLetterValue} type="text" length={4} />
      </div>
      <div>
        <p>Numbers only</p>
        <InputOTP value={numberValue} onChange={setNumberValue} />
      </div>
      <div>
        <p>Only uppercase letters allowed</p>
        <InputOTP type="text" length={4} validator={(char) => /^[A-Z]$/.test(char)} />
      </div>
    </Space>
  );
}
