import { useState } from "react";
import { InputNumber, Space } from "react-kui";

export default function App() {
  const [amount, setAmount] = useState<number | undefined>(100);
  const [decimal, setDecimal] = useState<number | undefined>(1.25);
  return (
    <Space vertical block style={{ maxWidth: 280 }}>
      <span>Drag inside the input left or right; click to type, double-click to select.</span>
      <InputNumber value={amount} onChange={setAmount} min={0} max={10000} addonAfter="USD" />
      <InputNumber value={decimal} onChange={setDecimal} step={0.01} precision={2} min={0} max={100} />
      <InputNumber value={10} draggable={false} placeholder="Drag disabled" />
    </Space>
  );
}
