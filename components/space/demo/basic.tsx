import { Search } from "kui-icons";
import { Button, Space, Tooltip } from "react-kui";
export default function App() {
  return (
    <Space>
      <Button>Button</Button>
      <Button icon={Search}>Button</Button>
      <Tooltip placement="top" title={<p style={{ margin: 0 }}>I am space</p>}>
        <Button>Space</Button>
      </Tooltip>
    </Space>
  );
}
