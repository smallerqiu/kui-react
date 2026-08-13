import { Card, CardMeta, Space } from "react-kui";

const cover =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=960&q=80";
const avatar = "https://cdn.chuchur.com/img/monkey.jpeg";

export default function App() {
  const meta = (
    <CardMeta
      avatar={avatar}
      title="山间旅居"
      description="远离城市喧嚣，在自然中度过一个安静的周末。"
    />
  );
  return (
    <Space wrap>
      <Card cover={cover} style={{ maxWidth: 360 }}>{meta}</Card>
      <Card cover={cover} bordered style={{ maxWidth: 360 }}>{meta}</Card>
    </Space>
  );
}
