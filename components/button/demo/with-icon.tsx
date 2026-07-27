import { ChevronDown, Power, Search } from "kui-icons";
import Icon from "../../icon";
import Space from "../../space";
import { Button } from "../index";
export default function WithIcon() {
  return (
    <Space wrap>
      <Button type="primary" icon={Search} shape="circle" />
      <Button type="primary" icon={Search}>
        Search
      </Button>
      <Button icon={Search} shape="circle" />
      <Button icon={Search}>Search</Button>
      <Button type="primary" icon={Power} />
      <Button icon={Power} />
      <Button type="primary">
        Expand
        <Icon type={ChevronDown} />
      </Button>
    </Space>
  );
}
