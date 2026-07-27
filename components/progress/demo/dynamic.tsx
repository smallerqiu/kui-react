import { Minus, Plus } from "kui-icons";
import { useState } from "react";
import { Button, ButtonGroup } from "../../button";
import Progress from "../index";
export default function Dynamic() {
  const [percent, setPercent] = useState(30),
    change = (step: number) => setPercent((value) => Math.max(0, Math.min(100, value + step)));
  return (
    <>
      <ButtonGroup>
        <Button onClick={() => change(-5)} icon={Minus} />
        <Button onClick={() => change(5)} icon={Plus} />
      </ButtonGroup>
      <Progress percent={percent} style={{ width: 300, marginBottom: 30 }} />
      <Progress percent={percent} type="circle" />
      <Progress percent={percent} type="dashboard" />
    </>
  );
}
