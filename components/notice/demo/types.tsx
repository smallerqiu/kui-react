import { Button } from "../../button";
import Space from "../../space";
import notice from "../index";
const types = ["info", "warning", "success", "error"] as const;
export default function Types() {
  return (
    <Space vertical>
      {types.map((type) => (
        <Button
          key={type}
          onClick={() => notice[type]({ title: "Title", content: "Content message.", duration: 5 })}
        >
          {type[0].toUpperCase() + type.slice(1)}
        </Button>
      ))}
    </Space>
  );
}
