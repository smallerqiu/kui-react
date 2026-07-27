import { Space, Slider } from "react-kui";
export default function Formatter() {
  return (
    <Space style={{ maxWidth: 520 }} vertical block>
      <code>format %</code>
      <Slider tipFormatter={(v) => `${v}%`} value={20} />
      <code>hide tooltip</code>
      <Slider tooltipVisible={false} value={20} />
      <code>show tooltip forever</code>
      <Slider value={70} tooltipVisible />
    </Space>
  );
}
