import { useRef } from "react";
import { Button, Space, message } from "react-kui";
export default function Close() {
  const count = useRef(0);
  return (
    <Space vertical>
      <Button onClick={() => message.success("Closing in 10s", 10)}>Closing in 10s</Button>
      <Button
        type="primary"
        onClick={() =>
          message.show({
            type: "info",
            duration: 0,
            closable: true,
            content: `Manually close ${++count.current}`,
            onClose: () => message.success("I am callback"),
          })
        }
      >
        Manually close
      </Button>
      <Button type="primary" onClick={message.destroy}>
        destroy
      </Button>
    </Space>
  );
}
