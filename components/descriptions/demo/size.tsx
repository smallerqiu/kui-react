import { useState } from "react";
import { Button, RadioGroup, Descriptions } from "react-kui";
import { BasicItems, DetailedItems } from "./content";
const types = [
  { label: "Large", value: "large" },
  { label: "Medium", value: "medium" },
  { label: "Small", value: "small" },
];
export default function App() {
  const [size, setSize] = useState<"large" | "medium" | "small">("medium"),
    extra = (
      <Button size="small" type="primary">
        Update Information
      </Button>
    );
  return (
    <>
      <RadioGroup
        options={types}
        value={size}
        type="button"
        theme="card"
        onChange={(v) => setSize(v as typeof size)}
      />
      <br />
      <br />
      <Descriptions title="Order Information" bordered size={size} extra={extra}>
        {DetailedItems()}
      </Descriptions>
      <br />
      <br />
      <Descriptions title="Order Information" size={size} extra={extra}>
        {BasicItems()}
      </Descriptions>
    </>
  );
}
