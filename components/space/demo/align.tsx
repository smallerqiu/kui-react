import { Button, Flex, Space } from "react-kui";
export default function App() {
  return (
    <Flex className="demo-space-align" wrap size="small">
      {(["start", "end", "center", "baseline"] as const).map((align) => (
        <Space
          align={align}
          key={align}
          style={{
            border: "1px solid var(--kui-color-border)",
            width: "calc(50% - 8px)",
            borderRadius: 4,
          }}
        >
          <div
            style={{
              height: 60,
              width: 80,
              display: "grid",
              placeItems: "center",
              background: "#92929252",
            }}
          >
            block
          </div>
          <Button>button</Button>
          <span>{align}</span>
        </Space>
      ))}
    </Flex>
  );
}
