import { useState } from "react";
import en from "react-kui/locale/en";
import zhCN from "react-kui/locale/zh-CN";
import { Calendar, ConfigProvider, RadioGroup, Space } from "react-kui";
export default function App() {
  const [language, setLanguage] = useState("zh");
  const [date, setDate] = useState("2026-08-23");
  return (
    <Space vertical style={{ width: "100%" }}>
      <RadioGroup
        type="button"
        options={[
          { label: "中文", value: "zh" },
          { label: "English", value: "en" },
        ]}
        value={language}
        onChange={(value) => setLanguage(String(value))}
      />
      <ConfigProvider locale={language === "en" ? en : zhCN}>
        <Calendar value={date} onChange={setDate} />
      </ConfigProvider>
    </Space>
  );
}
