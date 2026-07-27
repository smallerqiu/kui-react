import { LogoQq, LogoWechat, LogoX, LogoYoutube } from "kui-icons";
import Space from "../../space";
import Tag from "../index";
export default function WithIcon() {
  return (
    <Space wrap>
      <Tag icon={LogoX} color="#55acee">
        Twitter
      </Tag>
      <Tag icon={LogoYoutube} color="#cd201f">
        Youtube
      </Tag>
      <Tag icon={LogoQq} color="red">
        QQ
      </Tag>
      <Tag icon={LogoWechat} closeable color="green">
        Wechat
      </Tag>
    </Space>
  );
}
