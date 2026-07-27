import { KImage } from "../../../components/image";
import Space from "../../../components/space";
import Switch from "../../../components/switch";
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
