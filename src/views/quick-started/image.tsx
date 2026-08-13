import { KImage, Switch, Space } from "react-kui";
export default function SpecialComponents() {
  return (
    <Space vertical>
      <code>Switch</code>
      <Switch />
      <code>Image</code>
      <KImage src="https://cdn.chuchur.com/img/chick.jpeg" width={50} />
    </Space>
  );
}
