import { Button } from "../index";
import Flex from "../../flex";
import Space from "../../space";
const Buttons = ({ disabled = false }) => <Space vertical><Button disabled={disabled} type="primary">Primary{disabled && " (disabled)"}</Button><Button disabled={disabled} type="danger">Danger{disabled && " (disabled)"}</Button><Button disabled={disabled}>Default{disabled && " (disabled)"}</Button><Button disabled={disabled} theme="solid" color="green">Solid</Button><Button disabled={disabled} theme="outline">Outline</Button><Button disabled={disabled} theme="dashed">Dashed</Button><Button disabled={disabled} type="text">Text</Button><Button disabled={disabled} type="link">Link</Button></Space>;
export default function Disabled() { return <Flex size="small"><Buttons /><Buttons disabled /></Flex>; }
