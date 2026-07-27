import { Descriptions } from "react-kui";
import { DetailedItems } from "./content";
export default function VerticalBordered() {
  return (
    <Descriptions title="Order Information" bordered layout="vertical">
      {DetailedItems()}
    </Descriptions>
  );
}
