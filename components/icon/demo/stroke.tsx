import { ChevronRight, ChevronsRight } from "kui-icons";
import Icon from "../index";
export default function Stroke() {
  return (
    <div>
      {[1, 2, 4].map((width) => (
        <Icon key={`a${width}`} type={ChevronsRight} strokeWidth={width} />
      ))}
      <br />
      {[1, 2, 4].map((width) => (
        <Icon key={`b${width}`} type={ChevronRight} strokeWidth={width} />
      ))}
    </div>
  );
}
