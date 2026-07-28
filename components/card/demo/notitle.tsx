import { Space, Card } from "react-kui";
const Content = () => (
  <>
    <div>card content</div>
    <div>card content</div>
    <div>card content</div>
  </>
);
export default function App() {
  return (
    <Space vertical block className="demo-view-fill">
      <Card>
        <Content />
      </Card>
      <Card bordered>
        <Content />
      </Card>
    </Space>
  );
}
