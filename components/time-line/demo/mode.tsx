import { Hammer } from "kui-icons";
import { useState } from "react";
import { Radio, RadioGroup, TimeLine, TimeLineItem, type TimelineMode } from "react-kui";
const modes: TimelineMode[] = ["left", "center", "alternate", "right"];
export default function App() {
  const [mode, setMode] = useState<TimelineMode>("left");
  return (
    <>
      <RadioGroup value={mode} onChange={(value) => setMode(value as TimelineMode)}>
        {modes.map((value) => (
          <Radio key={value} label={value} value={value} />
        ))}
      </RadioGroup>
      <br />
      <br />
      <TimeLine mode={mode}>
        <TimeLineItem color="green" time="2020-11-03" extra="More auxiliary details">
          Optimized tons of improvements and experiences
        </TimeLineItem>
        <TimeLineItem color="orange" time="2020-11-02" extra="More auxiliary details">
          <div>Added some very user-friendly features</div>
          <div>Added some very user-friendly features</div>
        </TimeLineItem>
        <TimeLineItem icon={Hammer} color="red" time="2020-10-03" extra="More auxiliary details">
          Fix bug
        </TimeLineItem>
        <TimeLineItem time="2020-10-01" extra="More auxiliary details">
          Release version 1.0
        </TimeLineItem>
      </TimeLine>
    </>
  );
}
