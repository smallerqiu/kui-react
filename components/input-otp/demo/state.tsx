import { InputOTP, Space } from "react-kui";

export default function App() {
  return <Space vertical size="large"><code>Disabled</code><InputOTP defaultValue="123456" disabled /><code>Readonly</code><InputOTP defaultValue="123456" readOnly /></Space>;
}
