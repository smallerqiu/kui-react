import { useState } from "react";
import { CheckCard } from "react-kui";

export default function App() {
  const [agreed, setAgreed] = useState(false);
  return (
    <div className="demo-list" style={{ maxWidth: 480, display: "grid", gap: 12 }}>
      <CheckCard
        checked={agreed}
        onChange={(event) => setAgreed(event.checked)}
        title="同意用户协议"
        description="注册即表示你已阅读并接受服务条款与隐私政策。"
      />
      <span style={{ color: "var(--kui-color-text-description)" }}>
        当前状态：{agreed ? "已同意" : "未同意"}
      </span>
    </div>
  );
}
