import { ChevronLeft, ChevronRight, Heart, House, LogoKui, Mail, Settings } from "kui-icons";
// import {} from 'react-kui';

import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  CheckboxGroup,
  Content,
  DatePicker,
  Footer,
  Form,
  FormItem,
  Icon,
  Input,
  InputNumber,
  Layout,
  Menu,
  Option,
  Page,
  RadioGroup,
  Select,
  Sider,
  Space,
  KSwitch as Switch,
  Tag,
  TextArea,
  type ShapeType,
  type SizeType,
  type ThemeType,
} from "react-kui";
const sideItems = [
    { key: "1-1", icon: House, title: "Home" },
    { key: "1-2", icon: Heart, title: "Data statistics" },
    { key: "1-3", icon: Settings, title: "Settings" },
  ],
  topItems = [
    { key: "1", icon: Mail, title: "Navigation One" },
    { key: "2", icon: Heart, title: "Navigation Two", disabled: true },
    {
      key: "4",
      title: (
        <a href="https://react.k-ui.cn" target="_blank" rel="noreferrer">
          Navigation - Link
        </a>
      ),
    },
  ];
export default function LocalDark() {
  const [dark, setDark] = useState(false),
    [collapsed, setCollapsed] = useState(false),
    [current, setCurrent] = useState(["1"]),
    [side, setSide] = useState(["1-1"]),
    [size, setSize] = useState<SizeType>("medium"),
    [theme, setTheme] = useState<ThemeType>("default"),
    [shape, setShape] = useState<ShapeType>("round");
  return (
    <div>
      <style>{`.local-dark-layout .logo-box{display:flex;align-items:center;padding:16px;white-space:nowrap;overflow:hidden}.local-dark-layout .btn-expand{position:absolute;bottom:10px;left:12px}.local-dark-layout .demo-sider{position:relative;border-right:1px solid var(--kui-color-border);transition:.3s}.local-dark-panel{padding:20px;margin:20px;background:var(--kui-color-bg)}.local-dark-layout .k-layout-footer{text-align:center;color:#999}`}</style>
      <Button onClick={() => setDark(!dark)}>Local darkening</Button>
      <Layout className="local-dark-layout">
        <Sider className="demo-sider" style={{ width: collapsed ? 60 : 200 }}>
          <div className="logo-box">
            <Icon type={LogoKui} size={30} />
            {!collapsed && <span style={{ marginLeft: 8 }}>Dashboard</span>}
          </div>
          <Menu
            mode="inline"
            value={side}
            onSelect={({ key }) => setSide([key])}
            inlineCollapsed={collapsed}
            items={sideItems}
            style={{ border: "none" }}
          />
          <Button
            icon={collapsed ? ChevronRight : ChevronLeft}
            onClick={() => setCollapsed(!collapsed)}
            className="btn-expand"
          />
        </Sider>
        <Content>
          <Breadcrumb style={{ padding: "16px 0 0 16px" }}>
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbItem>List</BreadcrumbItem>
            <BreadcrumbItem>App</BreadcrumbItem>
          </Breadcrumb>
          <div {...{ "theme-mode": dark ? "dark" : "light" }} className="local-dark-panel">
            <Space vertical block>
              <Menu
                mode="horizontal"
                value={current}
                onSelect={({ key }) => setCurrent([key])}
                items={topItems}
              />
              <Page total={50} />
              <Space>
                {[1, 2, 3].map((n) => (
                  <Tag key={n} size={size} theme={theme} shape={shape}>
                    Tag{n}
                  </Tag>
                ))}
                <Tag size={size} theme={theme} shape={shape} closeable>
                  Tag4
                </Tag>
              </Space>
            </Space>
            <div style={{ width: 512, maxWidth: "100%" }}>
              <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                size={size}
                theme={theme}
                shape={shape}
              >
                <FormItem label="Shape">
                  <RadioGroup
                    value={shape}
                    onChange={setShape}
                    options={["round", "circle", "square"].map((value) => ({
                      value,
                      label: value,
                    }))}
                  />
                </FormItem>
                <FormItem label="Theme">
                  <RadioGroup
                    value={theme}
                    onChange={setTheme}
                    options={["fill", "outline", "default"].map((value) => ({
                      value,
                      label: value,
                    }))}
                  />
                </FormItem>
                <FormItem label="Size">
                  <RadioGroup
                    value={size}
                    onChange={setSize}
                    type="button"
                    options={["large", "medium", "small"].map((value) => ({ value, label: value }))}
                  />
                </FormItem>
                <FormItem label="Input">
                  <Input placeholder="input..." />
                </FormItem>
                <FormItem label="InputNumber">
                  <InputNumber placeholder="input..." />
                </FormItem>
                <FormItem label="Select">
                  <Select>
                    <Option value="0" label="Apple" />
                    <Option value="1" label="Banana" />
                    <Option value="2" label="Orange" />
                  </Select>
                </FormItem>
                <FormItem label="DatePicker">
                  <DatePicker />
                </FormItem>
                <FormItem label="Checkbox">
                  <CheckboxGroup
                    options={["Apple", "Banana", "Orange"].map((label, i) => ({
                      value: String(i),
                      label,
                    }))}
                  />
                </FormItem>
                <FormItem label="Switch">
                  <Switch trueText="Yes" falseText="No" />
                </FormItem>
                <FormItem label="Text">
                  <TextArea placeholder="Please input..." />
                </FormItem>
                <FormItem wrapperCol={{ offset: 8 }}>
                  <Button type="primary">Submit</Button>
                  <Button style={{ marginLeft: 10 }}>Cancel</Button>
                </FormItem>
              </Form>
            </div>
          </div>
          <Footer>KUI ©2018 Created by Qiu</Footer>
        </Content>
      </Layout>
    </div>
  );
}
