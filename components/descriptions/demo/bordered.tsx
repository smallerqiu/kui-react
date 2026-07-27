import { Descriptions } from "../index";
import { DetailedItems } from "./content";
export default function Bordered() {
  return (
    <Descriptions title="Order Information" bordered>
      {DetailedItems()}
    </Descriptions>
  );
}
