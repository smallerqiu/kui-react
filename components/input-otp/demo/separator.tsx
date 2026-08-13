import { InputOTP, Space } from "react-kui";

export default function App() {
  return <Space vertical size="large"><InputOTP length={4} separator="-" /><InputOTP length={4} separator="/" /><InputOTP defaultValue="123456" separator="•" /></Space>;
}
