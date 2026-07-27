import { Space, Button } from "react-kui";
export default function Theme() {
  return (
    <Space vertical>
      {(["outline", "dashed", "fill"] as const).map((theme) => (
        <div key={theme}>
          <code>{theme}</code>
          <Space size="small">
            <Button type="primary" theme={theme}>
              {theme}
            </Button>
            <Button type="danger" theme={theme}>
              {theme}
            </Button>
            <Button type="warning" theme={theme}>
              {theme}
            </Button>
            <Button theme={theme}>{theme}</Button>
          </Space>
        </div>
      ))}
    </Space>
  );
}
