import { Heart } from "kui-icons";
import Card from "../index";
export default function Border() {
  return (
    <div className="demo-view-fill">
      <Card title="Title" icon={Heart} bordered extra={<a href="#">more</a>}>
        <p>card content</p>
        <p>card content</p>
        <p>card content</p>
      </Card>
    </div>
  );
}
