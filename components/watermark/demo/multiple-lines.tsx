import Watermark, { type WatermarkTextItem } from "../index";
const content: WatermarkTextItem[] = [
  { text: "绝密文件 禁止外传", fontSize: 18, fontWeight: "bold", color: "rgba(239, 68, 68, 0.16)" },
  { text: "研发架构部 · 内部资产", fontSize: 14, color: "rgba(100, 116, 139, 0.12)" },
  { text: "操作人：张三 (9527)  2026-07-11", fontSize: 12, color: "rgba(148, 163, 184, 0.1)" },
];
export default function MultipleLines() {
  return (
    <Watermark
      layout="stagger"
      width={300}
      height={200}
      content={content}
      style={{ width: "100%", height: 500 }}
    >
      <div className="content-box" />
    </Watermark>
  );
}
