import { Heart, LogoWechat, Mail, Palette, Search, Settings, User } from "kui-icons";
import { useState, type CSSProperties } from "react";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  CheckboxGroup,
  ColorPicker,
  ColorPickerPanel,
  DatePicker,
  DatePickerPanel,
  Divider,
  FeatureCard,
  FeedbackPanel,
  Grid,
  GridItem,
  Input,
  InputNumber,
  InputOTP,
  Menu,
  MessagePanel,
  ModalPanel,
  NoticePanel,
  Option,
  Page,
  PopconfirmPanel,
  PoptipPanel,
  Progress,
  RadioGroup,
  Rate,
  Segmented,
  Select,
  Slider,
  Space,
  StatCard,
  Switch,
  TabPanel,
  Tabs,
  Tag,
  TimeLine,
  TimeLineItem,
  TooltipPanel,
  type MenuOptionsProps,
  type StatNumberItem,
} from "react-kui";

const options = [
  { label: "Option A", value: "1" },
  { label: "Option B", value: "2" },
  { label: "Option C", value: "3" },
];
const disabledOptions = [
  { label: "Option D", value: "4" },
  { label: "Option E", value: "5" },
];
const stats: Array<{ title: string; data: StatNumberItem }> = [
  {
    title: "请求数",
    data: {
      value: 12840,
      separator: ",",
      desc: "本月累计",
      trend: "+18.2% 较上月",
      trendStatus: "success",
    },
  },
  {
    title: "转化率",
    data: {
      value: 8.6,
      precision: 1,
      suffix: "%",
      desc: "本周平均",
      trend: "接近目标值",
      trendStatus: "warning",
    },
  },
];
const menuItems: MenuOptionsProps[] = [
  { title: "Navigation One", key: "1", icon: Mail },
  { title: "Navigation Two", key: "2", icon: Heart, disabled: true },
  {
    title: "Navigation - Submenu",
    key: "3",
    icon: Settings,
    children: [
      { title: "Option 1", key: "3-1" },
      { title: "Option 2", key: "3-2" },
    ],
  },
];
const shapeOptions = [
  { label: "Round", value: "round" },
  { label: "Square", value: "square" },
];
const styles = {
  page: {
    padding: "var(--local-demo-padding, 14px)",
    color: "var(--kui-color-text)",
    background: "var(--kui-color-bg)",
    border: "1px solid var(--kui-color-border)",
    borderRadius: "var(--kui-border-radius-card)",
    transition: "color .2s, background-color .2s",
  },
  toolbar: {
    display: "flex",
    alignItems: "var(--local-demo-toolbar-align, center)",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 12,
    padding: 2,
  },
  description: { color: "var(--kui-color-text-description)", fontSize: 12 },
  grid: { alignItems: "start" },
  cell: {
    minWidth: 0,
    padding: 14,
    border: "1px solid var(--kui-color-border)",
    borderRadius: "var(--kui-border-radius-card)",
  },
  modal: { minWidth: 0 },
  fullWidth: { width: "100%" },
  picker: { justifySelf: "stretch" },
} satisfies Record<string, CSSProperties>;

export default function LocalDark() {
  const [dark, setDark] = useState(true);
  const [shapeMode, setShapeMode] = useState<"round" | "square">("round");
  return (
    <div
      className="local-theme-page"
      style={styles.page}
      {...{ "theme-mode": dark ? "dark" : "light", "shape-mode": shapeMode }}
    >
      <style>{`
        .local-theme-page .k-tooltip-panel { min-height: 42px; }
        @media (max-width: 767px) {
          .local-theme-page {
            --local-demo-padding: 10px;
            --local-demo-toolbar-align: flex-start;
          }
          .local-theme-page .local-theme-toolbar { flex-direction: column; }
        }
      `}</style>
      <div className="local-theme-toolbar" style={styles.toolbar}>
        <Space vertical>
          <strong>Component overview</strong>
          <span style={styles.description}>Light and dark component states</span>
        </Space>
        <Space>
          <Button type="primary" theme="outline" onClick={() => setDark(!dark)}>
            {dark ? "Light mode" : "Dark mode"}
          </Button>
          <Segmented
            value={shapeMode}
            options={shapeOptions}
            onChange={(value) => setShapeMode(value as "round" | "square")}
          ></Segmented>
        </Space>
      </div>
      <Grid style={styles.grid} cols={{ xs: 1, md: 12 }} xGap={12} yGap={12} flow="row dense">
        <GridItem className="showcase-column" span={{ xs: 1, md: 7 }}>
          <Grid cols={1} yGap={12}>
            <GridItem style={styles.cell}>
              <Grid cols={6} xGap={10} yGap={12} align="center">
                <GridItem span={2}>
                  <Button type="primary" block>
                    Primary
                  </Button>
                </GridItem>
                <GridItem span={2}>
                  <Button block>Default</Button>
                </GridItem>
                <GridItem span={2}>
                  <Button type="danger" block>
                    Danger
                  </Button>
                </GridItem>
                <GridItem span={2}>
                  <Select style={styles.fullWidth} value="1" block>
                    <Option label="Option A" value="1" />
                    <Option label="Option B" value="2" />
                  </Select>
                </GridItem>
                <GridItem span={{ sm: 1, md: 3 }}>
                  <Space>
                    <DatePicker style={styles.fullWidth} value="2026-08-16" />
                    <DatePicker style={styles.fullWidth} value="2026-08-16" mode="dateTime" />
                  </Space>
                </GridItem>
                <GridItem span={6}>
                  <Space size="large" block>
                    <RadioGroup options={options} value="3" />
                    <RadioGroup options={disabledOptions} disabled value="5" />
                  </Space>
                </GridItem>
                <GridItem span={6}>
                  <Space size="large" block>
                    <CheckboxGroup options={options} value={["3"]} />
                    <CheckboxGroup options={disabledOptions} disabled value={["5"]} />
                  </Space>
                </GridItem>
                <GridItem span={6}>
                  <Space>
                    <Switch checked />
                    <Switch />
                    <Switch checked disabled />
                    <Switch disabled />
                    <Switch checked trueText="✓" falseText="×" />
                    <Switch trueText="✓" falseText="×" />
                    <ColorPicker value="#5798ff" />
                    <InputNumber />
                  </Space>
                </GridItem>
                <GridItem span={3}>
                  <Input style={styles.fullWidth} placeholder="Please input" />
                </GridItem>
                <GridItem span={3}>
                  <InputOTP value="2608" separator="·" length={4} size="small" />
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem style={styles.cell}>
              <Grid cols={6} xGap={12} yGap={12} align="center">
                <GridItem span={3}>
                  <Space>
                    <Rate value={3} />
                    <Rate value={2} icon={Heart} color="red" count={3} />
                  </Space>
                </GridItem>
                <GridItem span={3}>
                  <Space wrap>
                    <Tag color="green" icon={LogoWechat} closeable>
                      Wechat
                    </Tag>
                    <Tag color="red">Red</Tag>
                    <Tag color="#39f">#39f</Tag>
                    <Tag color="#e3f">#e3f</Tag>
                  </Space>
                </GridItem>
                <GridItem span={3}>
                  <Space vertical block>
                    <Alert style={styles.fullWidth} type="info">
                      Information message
                    </Alert>
                    <Alert style={styles.fullWidth} type="warning" bordered closable>
                      Warning message
                    </Alert>
                  </Space>
                </GridItem>
                <GridItem span={3}>
                  <Alert
                    style={styles.fullWidth}
                    type="success"
                    showIcon
                    message="Success Tip"
                    description="Congratulations, the operation is successful."
                  />
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem style={styles.cell}>
              <Grid cols={7} xGap={14} yGap={12} align="center">
                <GridItem span={7}>
                  <Progress percent={50} status="active" />
                </GridItem>
                <GridItem span={7}>
                  <Progress percent={70} status="exception" />
                </GridItem>
                <GridItem span={7}>
                  <Progress percent={100} />
                </GridItem>
                <GridItem span={4}>
                  <Space>
                    <Progress type="circle" percent={50} width={92} />
                    <Progress type="circle" percent={70} status="exception" width={92} />
                    <Progress type="circle" percent={100} width={92} />
                  </Space>
                </GridItem>
                <GridItem span={3}>
                  <Space wrap>
                    <Avatar shape="circle" icon={User} />
                    <Avatar shape="circle">U</Avatar>
                    <Avatar shape="circle" src="https://cdn.chuchur.com/img/chick.jpeg" />
                    <Avatar shape="square" icon={User} />
                    <Avatar shape="square">U</Avatar>
                    <Avatar shape="square" src="https://cdn.chuchur.com/img/chick.jpeg" />
                    <Badge count={1}>
                      <Avatar shape="square" icon={User} />
                    </Badge>
                    <Badge dot>
                      <Avatar shape="square" icon={User} />
                    </Badge>
                  </Space>
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem style={styles.cell}>
              <Grid cols={7} xGap={14} yGap={14} align="start">
                <GridItem span={7}>
                  <Space block>
                    {stats.map((item) => (
                      <StatCard
                        style={styles.fullWidth}
                        key={item.title}
                        title={item.title}
                        items={[item.data]}
                        reverse
                        bordered
                      />
                    ))}
                  </Space>
                </GridItem>
                <GridItem span={7}>
                  <Page page={1} total={150} />
                </GridItem>
                <GridItem span={7}>
                  <Tabs value="1">
                    <TabPanel key="1" title="Tab 1" />
                    <TabPanel key="2" title="Tab 2" />
                    <TabPanel key="3" title="Tab 3" />
                  </Tabs>
                </GridItem>
                <GridItem span={7}>
                  <Space wrap>
                    <Badge status="success" />
                    <Badge status="error" />
                    <Badge status="default" />
                    <Badge status="warning" />
                    <Badge status="success" text="Success" />
                    <Badge status="error" text="Error" />
                    <Badge status="default" text="Default" />
                    <Badge status="warning" text="Warning" />
                    <Badge active status="success" text="Success" />
                    <Badge active status="error" text="Error" />
                    <Badge active status="warning" text="Warning" />
                  </Space>
                </GridItem>
                <GridItem span={7}>
                  <Space block>
                    <FeatureCard
                      bordered
                      icon={Settings}
                      title="Flexible setup"
                      desc="Composable options."
                    />
                    <FeatureCard
                      icon={Palette}
                      title="Theme tokens"
                      desc="Colors, shapes and states."
                    />
                  </Space>
                </GridItem>
                <GridItem span={7}>
                  <FeedbackPanel
                    kind="positive"
                    heading="Ready"
                    description="All component states loaded."
                    compact
                  />
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem style={styles.cell}>
              <Menu style={styles.fullWidth} mode="horizontal" items={menuItems} />
              <Divider />
              <Grid cols={7} xGap={16} align="start">
                <GridItem span={4}>
                  <Menu items={menuItems} openKeys={["3"]} mode="inline" />
                </GridItem>
                <GridItem span={3}>
                  <TimeLine>
                    <TimeLineItem time="2026-08-16">Release version 5.5</TimeLineItem>
                    <TimeLineItem time="2025-10-25">Theme system update</TimeLineItem>
                    <TimeLineItem time="2024-10-08">Component refresh</TimeLineItem>
                  </TimeLine>
                </GridItem>
              </Grid>
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem className="showcase-column" span={{ xs: 1, md: 5 }}>
          <Grid cols={1} yGap={12}>
            <GridItem style={styles.modal}>
              <ModalPanel title="Basic Modal" width="100%">
                I am a Modal. I can do many things.
              </ModalPanel>
            </GridItem>
            <GridItem style={styles.cell}>
              <Space vertical block>
                <Slider value={20} step={10} />
                <Slider value={[25, 78]} range />
                <Slider value={60} disabled />
                <Input placeholder="Search components" icon={Search} />
              </Space>
            </GridItem>
            <GridItem style={styles.cell}>
              <Grid cols={5} xGap={12} yGap={16} align="center" justify="center">
                <GridItem span={5}>
                  <DatePickerPanel style={styles.picker} value="2026-08-16" />
                </GridItem>
                <GridItem span={5}>
                  <ColorPickerPanel style={styles.picker} value="#5798ff" />
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem style={styles.cell}>
              <Grid cols={2} xGap={14} yGap={18} align="start" flow="row dense">
                <GridItem>
                  <TooltipPanel title="How to behave?" />
                </GridItem>
                <GridItem span={2}>
                  <PopconfirmPanel title="Are you sure delete this task?" />
                </GridItem>
                <GridItem>
                  <PoptipPanel title="Title" content="I am poptip" placement="bottom-left" />
                </GridItem>
                <GridItem span={2}>
                  <MessagePanel type="success" content="Theme saved" />
                </GridItem>
                <GridItem span={2}>
                  <NoticePanel type="info" title="Build completed" content="Ready to preview." />
                </GridItem>
              </Grid>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </div>
  );
}
