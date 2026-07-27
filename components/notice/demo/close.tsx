import { useRef } from "react";
import { Button } from "../../button";
import message from "../../message";
import Space from "../../space";
import notice from "../index";
export default function Close() {
  const count = useRef(0);
  return (
    <Space vertical>
      <Button
        onClick={() =>
          notice.open({ type: "success", duration: 10, title: "Title", content: "Closing in 10s" })
        }
      >
        Closing in 10s
      </Button>
      <Button
        type="primary"
        onClick={() =>
          notice.open({
            type: "info",
            duration: 0,
            title: "Alert",
            content: `Manually close ${++count.current}`,
            onClose: () => message.success("I am a callback."),
          })
        }
      >
        Manually close
      </Button>
      <Button type="primary" onClick={notice.destroy}>
        Destroy
      </Button>
    </Space>
  );
}
