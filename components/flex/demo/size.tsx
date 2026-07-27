import { useState } from "react";
import { Button } from "../../button";
import type { SizeType } from "../../const/types";
import Flex, { type FlexSizeType } from "../index";
export default function SizeDemo() { const [size, setSize] = useState<FlexSizeType>("small"); const [custom, setCustom] = useState(false); return <Flex vertical size="medium"><Flex size="small">{(["small", "medium", "large"] as SizeType[]).map((item) => <Button key={item} type={size === item ? "primary" : "default"} onClick={() => { setCustom(false); setSize(item); }}>{item}</Button>)}<Button type={custom ? "primary" : "default"} onClick={() => setCustom(true)}>custom</Button></Flex>{custom && <input type="range" min={0} max={50} value={typeof size === "number" ? size : 8} onChange={(event) => setSize(Number(event.target.value))} />}<Flex size={size}><Button type="primary">Primary</Button><Button>Default</Button><Button type="text">Text</Button><Button type="link">Link</Button></Flex></Flex>; }
