import { Button } from "../../../components/button";
import Space from "../../../components/space";
export default function Buttons() {
  return (
    <Space vertical>
      <Button type="primary">Button</Button>
      <Button type="primary">Named import</Button>
      <Button type="primary">React component</Button>
    </Space>
  );
}
