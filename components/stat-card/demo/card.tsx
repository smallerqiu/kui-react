import { Heart, Star } from "kui-icons";
import { useState } from "react";
import {
  Checkbox,
  Grid,
  GridItem,
  Icon,
  RadioGroup,
  Space,
  StatCard,
  type SizeType,
  type StatNumberItem,
} from "react-kui";
const sizes: SizeType[] = ["small", "medium", "large"];
const items = [
  { value: 5872, desc: "Number of orders" },
  { value: 9873672, desc: "Total Order Amount", prefix: "￥" },
];
const items1 = [
  { value: 5872, desc: "Alipay Revenue", prefix: "$", precision: 2 },
  { value: 9873672, desc: "WeChat Revenue", prefix: "￥", precision: 2 },
];
const items2: StatNumberItem[] = [
  { value: 5872, desc: "Number of likes", prefix: <Icon type={Heart} /> },
  { value: 9873672, desc: "Number of Favorites", prefix: <Icon type={Star} /> },
];
export default function App() {
  const [showTitle, setShowTitle] = useState(true),
    [bordered, setBordered] = useState(false),
    [reverse, setReverse] = useState(false),
    [size, setSize] = useState<SizeType>("medium");
  const check =
    (setter: (value: boolean) => void) =>
    ({ checked }: { checked: boolean }) =>
      setter(checked);
  return (
    <Space vertical block>
      <Space>
        <Checkbox checked={showTitle} onChange={check(setShowTitle)}>
          Show Title
        </Checkbox>
        <Checkbox checked={bordered} onChange={check(setBordered)}>
          Show border
        </Checkbox>
        <Checkbox checked={reverse} onChange={check(setReverse)}>
          Reverse
        </Checkbox>
        <RadioGroup value={size} type="button" theme="card" options={sizes} onChange={setSize} />
      </Space>
      <Grid cols={{ xs: 1, sm: 2, md: 3 }} xGap={16} yGap={16}>
        <GridItem>
          <StatCard
            title={showTitle ? "Today's Orders" : undefined}
            reverse={reverse}
            items={items}
            bordered={bordered}
            size={size}
          />
        </GridItem>
        <GridItem>
          <StatCard
            statNumberType="rollup"
            title={showTitle ? "Today's income" : undefined}
            items={items1}
            bordered={bordered}
            reverse={reverse}
            size={size}
          />
        </GridItem>
        <GridItem span={{ xs: 1, sm: 2, md: 1 }}>
          <StatCard
            reverse={reverse}
            statNumberType="rollup"
            title={showTitle ? "Media data" : undefined}
            items={items2}
            bordered={bordered}
            size={size}
          />
        </GridItem>
      </Grid>
    </Space>
  );
}
