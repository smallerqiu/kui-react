import { Heart } from "kui-icons";
import Card from "../index";
export default function Basic() {
  return (
    <Card title="Title" icon={Heart} extra={<a href="#">more</a>}>
      <div>card content</div>
      <div>card content</div>
      <div>card content</div>
    </Card>
  );
}
