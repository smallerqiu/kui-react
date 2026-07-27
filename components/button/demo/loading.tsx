import { Power, Search } from "kui-icons";
import { useState } from "react";
import { Space, Button } from "react-kui";
export default function LoadingDemo() {
  const [loading, setLoading] = useState(false);
  const [delayed, setDelayed] = useState(false);
  return (
    <Space wrap>
      <Button type="primary" icon={Search} loading>
        Loading
      </Button>
      <Button type="primary" icon={Search} loading size="small">
        Loading
      </Button>
      <Button type="primary" loading shape="circle" />
      <Button type="primary" loading={loading} onClick={() => setLoading(true)}>
        Click me
      </Button>
      <Button
        type="primary"
        icon={Power}
        loading={delayed}
        onClick={() => setTimeout(() => setDelayed(true), 1000)}
      >
        1s delay
      </Button>
    </Space>
  );
}
