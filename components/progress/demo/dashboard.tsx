import { useState } from "react";
import { RadioGroup } from "../../radio";
import Slider from "../../slider";
import Progress, { type ProgressStroke } from "../index";
const caps = [
  { label: "Butt", value: "butt" },
  { label: "Round", value: "round" },
  { label: "Square", value: "square" },
];
export default function Dashboard() {
  const [gap, setGap] = useState(140),
    [cap, setCap] = useState<ProgressStroke>("round");
  return (
    <>
      gapDegree：{gap}
      <Slider value={gap} min={50} max={160} onChange={(v) => setGap(v as number)} />
      <br />
      <br />
      <RadioGroup
        options={caps}
        value={cap}
        type="button"
        theme="card"
        onChange={(v) => setCap(v as ProgressStroke)}
      />
      <br />
      <br />
      <Progress type="dashboard" percent={50} gapDegree={gap} strokeLinecap={cap} />
      <Progress type="dashboard" percent={100} gapDegree={gap} strokeLinecap={cap} />
    </>
  );
}
