import { Button } from "../../button";
import Space from "../../space";
import message from "../index";
export default function Types() {
  return (
    <Space vertical>
      <Button onClick={() => message.warning("I am a warning message.")}>Warning</Button>
      <Button onClick={() => message.success("I am a success message.")}>Success</Button>
      <Button onClick={() => message.error("I am an error message.")}>Error</Button>
    </Space>
  );
}
