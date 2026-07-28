import { Button, Space, ColorPicker } from "react-kui";
const placements = [
  "bottom-left",
  "bottom",
  "bottom-right",
  "top-left",
  "top",
  "top-right",
] as const;
export default function App() {
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
