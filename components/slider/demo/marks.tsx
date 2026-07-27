import { Space, Slider } from "react-kui";
export default function Marks() {
  return (
    <Space style={{ maxWidth: 520 }} vertical block>
      <code>step=10</code>
      <Slider
        step={10}
        marks={{ 10: "10", 20: "20", 30: "30", 40: "40", 50: "50", 80: "80" }}
        value={[10, 80]}
        max={80}
        min={10}
        range
      />
      <br />
      <code>step=0.1</code>
      <Slider
        step={0.1}
        marks={{ 0.1: "0.1", 0.2: "0.2", 0.3: "0.3", 0.4: "0.4", 0.5: "0.5" }}
        min={0}
        max={1}
        value={[0.1, 0.5]}
        range
      />
      <br />
      <code>Marks & step=10</code>
      <Slider marks={{ 25: "25°C", 36: "36°C" }} step={10} value={[0, 100]} range />
      <br />
      <code>step=null</code>
      <Slider
        marks={{ 0: "0°C", 25: "25°C", 36: "36°C", 100: "100°C" }}
        step={null}
        value={[0, 100]}
        range
      />
      <Slider marks={{ 0: "0°C", 25: "25°C", 36: "36°C", 100: "100°C" }} step={null} value={25} />
      <br />
      <code>Included</code>
      <Slider marks={{ 20: "20°C", 40: "40°C" }} included={false} value={[0, 100]} range />
    </Space>
  );
}
