import { Heart, Wifi, WifiHigh, WifiLow, WifiOff, WifiZero } from "kui-icons";
import { Space, Rate } from "react-kui";
const icons = [WifiOff, WifiZero, WifiLow, WifiHigh, Wifi];
export default function Character() {
  return (
    <Space vertical>
      <Rate icon={Heart} allowHalf value={1.5} />
      <code>character = A</code>
      <Rate character="A" allowHalf value={2.5} />
      <code>character = 龍</code>
      <Rate character="龍" allowHalf value={3.5} size={24} />
      <br />
      <code>count = 9</code>
      <Rate character={(index) => index} value={2} count={9} />
      <Rate icon={(index) => icons[index - 1]} value={3} />
    </Space>
  );
}
