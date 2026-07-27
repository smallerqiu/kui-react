import { useState } from "react";
import { Button } from "../../button";
import { RadioGroup } from "../../radio";
import { Descriptions } from "../index";
import { BasicItems, DetailedItems } from "./content";
const types = [
  { label: "Large", value: "medium" },
  { label: "Medium", value: "medium" },
  { label: "Small", value: "small" },
];
export default function Size() {
  const [size, setSize] = useState<"medium" | "small">("medium"),
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
