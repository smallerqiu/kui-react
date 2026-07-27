import { Descriptions } from "../index";
import { DetailedItems } from "./content";
export default function VerticalBordered() {
  return (
    <Descriptions title="Order Information" bordered layout="vertical">
      {DetailedItems()}
    </Descriptions>
  );
}
