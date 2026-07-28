import { Heart, Star } from "kui-icons";
import { useState } from "react";
import { Checkbox, Grid, GridItem, Icon, Space, StatCard, type StatNumberItem } from "react-kui";
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
    [reverse, setReverse] = useState(false);
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
      </Space>
      <Grid cols={{ xs: 1, sm: 2, md: 3 }} xGap={16} yGap={16}>
        <GridItem>
          <StatCard
            title={showTitle ? "Today's Orders" : undefined}
            reverse={reverse}
            items={items}
            bordered={bordered}
          />
        </GridItem>
        <GridItem>
          <StatCard
            statNumberType="rollup"
            title={showTitle ? "Today's income" : undefined}
            items={items1}
            bordered={bordered}
            reverse={reverse}
          />
        </GridItem>
        <GridItem span={{ xs: 1, sm: 2, md: 1 }}>
          <StatCard
            reverse={reverse}
            statNumberType="rollup"
            title={showTitle ? "Media data" : undefined}
            items={items2}
            bordered={bordered}
          />
        </GridItem>
      </Grid>
    </Space>
  );
}
