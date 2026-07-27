import { Button } from "../../button";
import Space from "../../space";
import notice from "../index";
export default function Basic() {
  return (
    <Space vertical>
      <Button
        type="primary"
        onClick={() =>
          notice.open({ title: "Title", content: "The content of the notice.", duration: 5 })
        }
      >
        Notice
      </Button>
    </Space>
  );
}
