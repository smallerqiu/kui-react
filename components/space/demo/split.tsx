import Divider from "../../divider";
import Space from "../index";
export default function Split() { return <Space split={<Divider type="vertical" />}><a href="#">Edit</a><a href="#">Save</a><a href="#">Delete</a></Space>; }
