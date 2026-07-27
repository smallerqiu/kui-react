import { CircleQuestionMark, LogoYen, UserPlus } from "kui-icons";
import { Button, Divider, Space, Tooltip, InputNumber } from "react-kui";
export default function Affix() {
  return (
    <>
      <Space block vertical>
        <InputNumber placeholder="Please input amount" suffix="元" prefix="¥" />
        <InputNumber placeholder="Please input amount" step={50} suffix="元" prefix="充值" />
        <InputNumber placeholder="Please input amount" suffix=".00" />
      </Space>
      <Divider text="React nodes" />
      <Space vertical block>
        <InputNumber
          placeholder="请填写您的薪资"
          icon={LogoYen}
          suffixSlot={
            <Tooltip title="此处如果不知道怎么填，请咨询管理员">
              <Button icon={CircleQuestionMark} />
            </Tooltip>
          }
        />
        <InputNumber
          placeholder="Please input amount"
          prefixSlot={<Button icon={UserPlus} />}
          suffixSlot={<Button>Top up</Button>}
        />
      </Space>
    </>
  );
}
