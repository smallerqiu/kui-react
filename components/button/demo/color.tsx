import { Button, Space } from "react-kui";
const colors = [
  "default",
  "red",
  "orange",
  "yellow",
  "olive",
  "green",
  "teal",
  "blue",
  "volcano",
  "violet",
  "cyan",
  "gold",
  "lime",
  "magenta",
  "purple",
  "pink",
  "brown",
];
export default function App() {
  return (
    <Space size="small" wrap>
      {(["solid", "outline", "dashed"] as const).map((theme) => (
        <Space size="small" wrap key={theme}>
          {colors.map((color) => (
            <Button color={color} key={color} theme={theme}>
              {theme}
            </Button>
          ))}
        </Space>
      ))}
    </Space>
  );
}
