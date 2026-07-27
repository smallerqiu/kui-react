import { Heart, Star } from "kui-icons";
import { useRef } from "react";
import { Icon, message, Space, KImage, type ImageRef } from "react-kui";
export default function Extra() {
  const ref = useRef<ImageRef>(null),
    toggle = () => ref.current?.togglePanel();
  return (
    <Space vertical>
      <KImage
        width={120}
        height={120}
        src="https://cdn.chuchur.com/upload/demo/test_300.jpg"
        onClose={() => message.info("close")}
        ref={ref}
        tools={
          <>
            <Icon type={Heart} color="#3a95ff" onClick={toggle} />
            <Icon type={Star} color="#3a95ff" onClick={toggle} />
          </>
        }
        panel={<div>Some thing here.</div>}
      />
    </Space>
  );
}
