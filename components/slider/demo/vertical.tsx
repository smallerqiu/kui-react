import Space from "../../space";
import Slider from "../index";
export default function Vertical() {
  return (
    <Space style={{ height: 300 }} block size={35}>
      <Slider style={{ height: "100%" }} vertical value={35} size="small" />
      <Slider style={{ height: "100%" }} vertical reverse value={35} />
      <Slider style={{ height: "100%" }} vertical range value={[20, 60]} />
      <Slider
        style={{ height: "100%" }}
        vertical
        range
        marks={{ 20: "20°C", 40: "40°C" }}
        step={10}
        value={[20, 60]}
      />
      <Slider
        style={{ height: "100%" }}
        vertical
        reverse
        size="small"
        range
        marks={{ 0: "0°C", 25: "25°C", 36: "36°C", 100: "100°C" }}
        step={10}
        value={[20, 60]}
      />
    </Space>
  );
}
