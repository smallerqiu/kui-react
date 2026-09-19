import { Heart, Star } from "kui-icons";
import { useState } from "react";
import {
  Checkbox,
  Grid,
  GridItem,
  Icon,
  Segmented,
  Space,
  StatCard,
  type SizeType,
  type StatNumberItem,
  type StatCardProps,
} from "react-kui";
const sizes = ["small", "medium", "large"].map((value) => ({ value, label: value }));
const themeOptions = ["outline", "fill", "plain"].map((value) => ({ value, label: value }));
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
    [theme, setTheme] = useState<NonNullable<StatCardProps["theme"]>>("fill"),
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
        <Checkbox checked={reverse} onChange={check(setReverse)}>
          Reverse
        </Checkbox>
        <Segmented value={size} options={sizes} onChange={(value) => setSize(value as SizeType)} />
        <Segmented
          value={theme}
          options={themeOptions}
          onChange={(value) => setTheme(value as typeof theme)}
        />
      </Space>
      <Grid cols={{ xs: 1, sm: 2, md: 3 }} xGap={16} yGap={16}>
        <GridItem>
          <StatCard
            title={showTitle ? "Today's Orders" : undefined}
            reverse={reverse}
            items={items}
            theme={theme}
            size={size}
          />
        </GridItem>
        <GridItem>
          <StatCard
            statNumberType="rollup"
            title={showTitle ? "Today's income" : undefined}
            items={items1}
            theme={theme}
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
            theme={theme}
            size={size}
          />
        </GridItem>
      </Grid>
    </Space>
  );
}
