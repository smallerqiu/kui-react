import { Cloud, Heart, House } from "kui-icons";
import { Space, Breadcrumb, BreadcrumbItem } from "react-kui";
const Items = () => (
  <>
    <BreadcrumbItem href="/" icon={House} />
    <BreadcrumbItem href="/components/breadcrumb" icon={Cloud}>
      Breadcrumb
    </BreadcrumbItem>
    <BreadcrumbItem icon={Heart}>Other</BreadcrumbItem>
  </>
);
export default function Separator() {
  return (
    <Space vertical>
      <Breadcrumb separator=">">
        <Items />
      </Breadcrumb>
      <Breadcrumb separator={<span style={{ color: "red" }}>›</span>}>
        <Items />
      </Breadcrumb>
    </Space>
  );
}
