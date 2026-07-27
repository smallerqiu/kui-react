import { Copy } from "kui-icons";
import { Button } from "../../button";
import DatePicker from "../../date-picker";
import InputNumber from "../../input-number";
import { Option, Select } from "../../select";
import Space from "../../space";
import Tooltip from "../../tooltip";
import TreeSelect from "../../tree-select";
import { Input, InputGroup } from "../index";
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
const options = (prefix: string) => (
  <>
    <Option value={`${prefix}-1`}>{prefix}-1</Option>
    <Option value={`${prefix}-2`}>{prefix}-2</Option>
  </>
);
export default function Group() {
  return (
    <Space vertical size="medium" block style={{ width: 600, maxWidth: "100%" }}>
      <InputGroup>
        <Input style={{ width: "20%" }} value="027" />
        <Input style={{ width: "30%" }} value="28398987" />
      </InputGroup>
      <InputGroup size="small">
        <Input style={{ width: "calc(100% - 200px)" }} value="https://react.k-ui.cn" />
        <Button type="primary">Submit</Button>
      </InputGroup>
      <InputGroup>
        <Input style={{ width: "calc(100% - 200px)" }} value="https://react.k-ui.cn" />
        <Button type="primary">Submit</Button>
      </InputGroup>
      <InputGroup>
        <Input
          style={{ width: "calc(100% - 200px)" }}
          value="git@gitee.com:chuchur/kui-react.git"
        />
        <Tooltip title="copy git url">
          <Button icon={Copy} />
        </Tooltip>
      </InputGroup>
      <InputGroup>
        <Select value="Shenzheng" clearable>
          <Option value="Wuhan">Wuhan001</Option>
          <Option value="Shenzheng">Shenzheng</Option>
        </Select>
        <Input style={{ width: "50%" }} value="Nanshan District, Shenzheng" />
      </InputGroup>
      <InputGroup>
        <Select clearable multiple value={["Wuhan001"]} style={{ width: "50%" }} maxTagCount={1}>
          <Option value="Wuhan001">Wuhan001</Option>
          <Option value="Shenzheng">Shenzheng</Option>
        </Select>
        <Input style={{ width: "50%" }} value="Nanshan District, Shenzheng" />
      </InputGroup>
      <InputGroup>
        <Input style={{ width: "30%" }} value="0755" />
        <Input clearable style={{ width: "50%" }} value="28398987" />
        <Input style={{ width: "20%" }} value="+1" />
      </InputGroup>
      <InputGroup>
        <Select value="Option1">{options("Option")}</Select>
        <Input style={{ width: "50%" }} value="input content" />
        <InputNumber value={12} />
      </InputGroup>
      <InputGroup>
        <Input style={{ width: "50%" }} value="input content" icon={Copy} />
        <DatePicker />
      </InputGroup>
      <InputGroup>
        <DatePicker mode="dateRange" />
        <Input style={{ width: "30%" }} value="input content" />
        <Button type="primary">Query</Button>
      </InputGroup>
      <InputGroup>
        <Input style={{ width: "30%" }} value="input content" />
        <DatePicker mode="dateRange" />
      </InputGroup>
      <InputGroup>
        <Select value="Option1-1">{options("Option1")}</Select>
        <Select value="Option2-2">{options("Option2")}</Select>
      </InputGroup>
      <InputGroup>
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
      </InputGroup>
      <InputGroup>
        <Select value="Option1-1">{options("Option1")}</Select>
        <TreeSelect treeData={treeData} clearable style={{ width: 200 }} />
      </InputGroup>
    </Space>
  );
}
