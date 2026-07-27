import { Flex, Button } from "react-kui";
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
export default function ColorDemo() {
  return (
    <Flex size="small" wrap>
      {(["solid", "outline", "dashed"] as const).map((theme) => (
        <Flex size="small" wrap key={theme}>
          {colors.map((color) => (
            <Button color={color as any} key={color} theme={theme}>
              {theme}
            </Button>
          ))}
        </Flex>
      ))}
    </Flex>
  );
}
