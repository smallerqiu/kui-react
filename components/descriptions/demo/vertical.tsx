import { Descriptions } from "react-kui";
import { BasicItems } from "./content";
export default function Vertical() {
  return (
    <Descriptions title="Order Information" layout="vertical">
      {BasicItems()}
    </Descriptions>
  );
}
