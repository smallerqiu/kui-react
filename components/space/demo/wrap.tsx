import { Button } from "../../button";
import Space from "../index";
export default function Wrap() { return <Space size={[8, 20]} wrap>{Array.from({ length: 25 }, (_, index) => <Button size="small" key={index}>Wrap</Button>)}</Space>; }
