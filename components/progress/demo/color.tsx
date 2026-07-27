import { Minus, Plus } from "kui-icons";
import { useState } from "react";
import { Button, ButtonGroup, Progress } from "react-kui";
const getColor = (v: number) =>
  v >= 80 ? "#f79e08" : v >= 50 ? "#c7b98d" : v >= 30 ? "#bdc78d" : "";
const strength = (v: number) => (v < 30 ? "Empty" : v < 50 ? "Weak" : v < 80 ? "Normal" : "Strong");
export default function Color() {
  const [percent, setPercent] = useState(0),
    change = (step: number) => setPercent((v) => Math.max(0, Math.min(100, v + step))),
    color = getColor(percent);
  return (
    <>
      <Progress
        percent={percent}
        format={strength}
        color={color}
        style={{ width: 300, marginBottom: 30 }}
      />
      <Progress percent={percent} type="circle" format={(v) => `${v}℃`} color={color} />
      <Progress percent={percent} type="dashboard" format={(v) => `${v}L`} color={color} />
      <br />
      <ButtonGroup>
        <Button onClick={() => change(-5)} icon={Minus} />
        <Button onClick={() => change(5)} icon={Plus} />
      </ButtonGroup>
    </>
  );
}
