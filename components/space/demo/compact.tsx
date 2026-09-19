import { Copy } from "kui-icons";
import {
  Button,
  ColorPicker,
  DatePicker,
  Input,
  InputNumber,
  Option,
  Select,
  Space,
  Tooltip,
  TreeSelect,
} from "react-kui";

const treeData = [
  {
    title: "fruit",
    key: "1",
    children: [
      { title: "apple", key: "11" },
      { title: "orange", key: "12" },
    ],
  },
];

export default function App() {
  return (
    <Space vertical size="medium" block style={{ maxWidth: 520 }}>
      <Space compact style={{ width: "50%" }}>
        <Input style={{ width: "50%" }} value="027" readOnly />
        <Input style={{ width: "50%" }} value="28398987" readOnly />
      </Space>
      <Space compact size="small" block>
        <Input style={{ width: "calc(100% - 200px)" }} value="https://k-ui.cn" readOnly />
        <Button type="primary">Submit</Button>
      </Space>
      <Space compact block>
        <Input style={{ width: "calc(100% - 200px)" }} value="https://k-ui.cn" readOnly />
        <Button type="primary">Submit</Button>
      </Space>
      <Space compact block>
        <Input
          style={{ width: "calc(100% - 200px)" }}
          value="git@github.com:smallerqiu/react-kui.git"
          readOnly
        />
        <Tooltip title="copy git url">
          <Button icon={Copy} />
        </Tooltip>
      </Space>
      <Space compact block>
        <Select value="Shenzheng" clearable>
          <Option value="Wuhan">Wuhan001</Option>
          <Option value="Shenzheng">Shenzheng</Option>
        </Select>
        <Input style={{ width: "50%" }} value="Nanshan District, Shenzheng" readOnly />
      </Space>
      <Space compact block>
        <Select clearable multiple value={["Wuhan001"]} style={{ width: "50%" }}>
          <Option value="Wuhan001">Wuhan001</Option>
          <Option value="Shenzheng">Shenzheng</Option>
        </Select>
        <Input style={{ width: "50%" }} value="Nanshan District, Shenzheng" readOnly />
      </Space>
      <Space compact block>
        <Input style={{ width: "30%" }} value="0755" readOnly />
        <Input clearable style={{ width: "50%" }} value="28398987" readOnly />
        <Input style={{ width: "20%" }} value="+1" readOnly />
      </Space>
      <Space compact block>
        <Select value="Option1">
          <Option value="Option1">Option1</Option>
          <Option value="Option2">Option2</Option>
        </Select>
        <Input style={{ width: "50%" }} value="input content" readOnly />
        <InputNumber value={12} />
      </Space>
      <Space compact block>
        <Input style={{ width: "50%" }} value="input content" readOnly />
        <DatePicker />
      </Space>
      <Space compact block>
        <DatePicker mode="dateRange" />
        <Input style={{ width: "30%" }} value="input content" readOnly />
        <Button type="primary">Query</Button>
      </Space>
      <Space compact block>
        <Input style={{ width: "30%" }} value="input content" readOnly />
        <DatePicker mode="dateRange" />
      </Space>
      <Space compact>
        <Select value="Option1-1">
          <Option value="Option1-1">Option1-1</Option>
          <Option value="Option1-2">Option1-2</Option>
        </Select>
        <Select value="Option2-2">
          <Option value="Option2-1">Option2-1</Option>
          <Option value="Option2-2">Option2-2</Option>
        </Select>
      </Space>
      <Space compact>
        <Select value="1">
          <Option value="1">Between</Option>
          <Option value="2">Except</Option>
        </Select>
        <Input style={{ width: 100, textAlign: "center" }} placeholder="Minimum" />
        <Input
          style={{ width: 30, borderLeft: 0, borderRight: 0, pointerEvents: "none" }}
          placeholder="~"
          disabled
        />
        <Input style={{ width: 100, textAlign: "center" }} placeholder="Maximum" />
      </Space>
      <Space compact>
        <Select value="Option1-1">
          <Option value="Option1-1">Option1-1</Option>
          <Option value="Option1-2">Option1-2</Option>
        </Select>
        <TreeSelect treeData={treeData} clearable style={{ width: 200 }} />
      </Space>
      <Space compact>
        <Select value="Option1-1">
          <Option value="Option1-1">Option1-1</Option>
          <Option value="Option1-2">Option1-2</Option>
        </Select>
        <ColorPicker />
      </Space>
    </Space>
  );
}
