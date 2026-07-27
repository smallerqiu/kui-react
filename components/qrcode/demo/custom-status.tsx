import { CircleCheck } from "kui-icons";
import { useState } from "react";
import { Button } from "../../button";
import Icon from "../../icon";
import Space from "../../space";
import Spin from "../../spin";
import QRCode, { type QRCodeStatus } from "../index";
export default function CustomStatus() {
  const [url, setUrl] = useState("https://react.k-ui.cn"),
    [status, setStatus] = useState<QRCodeStatus>("expired");
  const refresh = () => {
    setStatus("loading");
    setTimeout(() => {
      setUrl("https://xxx.com/pay");
      setStatus("active");
    }, 1000);
  };
  return (
    <Space wrap>
      <QRCode value={url} size={100} />
      <QRCode
        value={url}
        status="loading"
        size={100}
        loadingContent={
          <>
            <Spin mode="bounce" />
            <p>疯狂加载中...</p>
          </>
        }
      />
      <QRCode
        value={url}
        status={status}
        size={100}
        expiredContent={
          <Button type="primary" onClick={refresh} size="small">
            刷新二维码
          </Button>
        }
      />
      <QRCode
        value={url}
        status="scanned"
        size={100}
        scannedContent={
          <>
            <Icon type={CircleCheck} color="green" size={30} />
            <div>支付成功</div>
          </>
        }
      />
    </Space>
  );
}
