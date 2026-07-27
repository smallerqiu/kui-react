import { Descriptions } from "../index";
import { BasicItems } from "./content";
export default function Vertical() {
  return (
    <Descriptions title="Order Information" layout="vertical">
      {BasicItems()}
    </Descriptions>
  );
}
