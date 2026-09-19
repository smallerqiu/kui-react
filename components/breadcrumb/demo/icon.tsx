import { Cloud, Heart, House } from "kui-icons";
import { Breadcrumb, BreadcrumbItem } from "react-kui";
export default function App() {
  return (
    <Breadcrumb>
      <BreadcrumbItem href="/" icon={House}>
        Home
      </BreadcrumbItem>
      <BreadcrumbItem href="/components/breadcrumb" icon={Cloud}>
        App
      </BreadcrumbItem>
      <BreadcrumbItem icon={Heart}>Other</BreadcrumbItem>
    </Breadcrumb>
  );
}
