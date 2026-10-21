import { Button, Space } from "react-kui";
const colors = [
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
  "gray",
];
export default function App() {
  return (
    <Space size="small" wrap>
      {([undefined, "solid", "outline", "dashed"] as const).map((theme) => (
        <Space size="small" wrap key={theme ?? "no-theme"}>
          {colors.map((color) => (
            <Button color={color} key={color} theme={theme}>
              {theme ?? "no theme"}
            </Button>
          ))}
        </Space>
      ))}
    </Space>
  );
}
