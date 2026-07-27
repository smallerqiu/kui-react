import { Button } from "../../button";
import Space from "../../space";
import ColorPicker from "../index";
const placements = [
  "bottom-left",
  "bottom",
  "bottom-right",
  "top-left",
  "top",
  "top-right",
] as const;
export default function Placement() {
  return (
    <Space wrap>
      {placements.map((placement) => (
        <ColorPicker key={placement} value="red" size="small" placement={placement}>
          <Button>{placement}</Button>
        </ColorPicker>
      ))}
    </Space>
  );
}
