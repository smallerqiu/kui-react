import Space from "../../space";
import Card from "../index";
const Content = () => (
  <>
    <div>card content</div>
    <div>card content</div>
    <div>card content</div>
  </>
);
export default function NoTitle() {
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
