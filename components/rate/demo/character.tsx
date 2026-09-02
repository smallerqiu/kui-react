import { Heart, Wifi, WifiHigh, WifiLow, WifiOff, WifiZero } from "kui-icons";
import { Space, Rate } from "react-kui";
const icons = [WifiOff, WifiZero, WifiLow, WifiHigh, Wifi];
export default function App() {
  return (
    <Space vertical>
      <Rate icon={Heart} allowHalf defaultValue={1.5} />
      <code>character = A</code>
      <Rate character="A" allowHalf defaultValue={2.5} />
      <code>character = 龍</code>
      <Rate character="龍" allowHalf defaultValue={3.5} size={24} />
      <br />
      <code>count = 9</code>
      <Rate character={(index) => index} defaultValue={2} count={9} />
      <Rate icon={(index) => icons[index - 1]} defaultValue={3} />
    </Space>
  );
}
