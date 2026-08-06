import type { CSSProperties } from "react";
import { Grid, GridItem } from "react-kui";

interface Feature {
  id: number;
  title: string;
  desc: string;
  span: { xs: number; md: number; xl: number };
  rowSpan: number;
  color: string;
  textColor?: string;
  border?: string;
}

const features: Feature[] = [
  {
    id: 1,
    title: "自研芯片 M3 Max",
    desc: "极致算力，从容应对专业级工作流。",
    span: { xs: 2, md: 3, xl: 4 },
    rowSpan: 3,
    color: "var(--kui-color-bg-4)",
    textColor: "#fff",
  },
  {
    id: 2,
    title: "超长续航",
    desc: "长达 22 小时视频播放。",
    span: { xs: 1, md: 3, xl: 2 },
    rowSpan: 2,
    color: "#f5f5f7",
  },
  {
    id: 3,
    title: "5G 超高速",
    desc: "随时随地，畅享疾速。",
    span: { xs: 1, md: 3, xl: 2 },
    rowSpan: 1,
    color: "#e8e8ed",
  },
  {
    id: 4,
    title: "Retina 显示屏",
    desc: "绚丽色彩，纤毫毕现。",
    span: { xs: 2, md: 3, xl: 4 },
    rowSpan: 2,
    color: "#fff",
    border: "1px solid var(--kui-color-border)",
  },
  {
    id: 5,
    title: "隐私保护",
    desc: "你的数据，由你掌控。",
    span: { xs: 1, md: 3, xl: 2 },
    rowSpan: 2,
    color: "#f2f2f2",
  },
  {
    id: 6,
    title: "多设备协作",
    desc: "无缝衔接，效率翻倍。",
    span: { xs: 1, md: 3, xl: 2 },
    rowSpan: 1,
    color: "#fafafa",
  },
];

const cardStyle: CSSProperties = {
  height: "100%",
  borderRadius: 24,
  padding: 32,
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  transition: "transform 0.2s ease-in-out",
  cursor: "pointer",
};

export default function App() {
  return (
    <div style={{ padding: "40px 20px", maxWidth: "100%", margin: "0 auto" }}>
      <h1
        style={{
          marginBottom: 32,
          fontWeight: 600,
          fontSize: "2rem",
          color: "var(--kui-color-text)",
        }}
      >
        技术规格矩阵
      </h1>

      <Grid
        cols={{ xs: 2, md: 6, xl: 8 }}
        xGap={20}
        yGap={20}
        autoRows="120px"
        style={{ gridAutoFlow: "dense" }}
      >
        {features.map((item) => (
          <GridItem key={item.id} span={item.span} rowSpan={item.rowSpan}>
            <div
              style={{
                ...cardStyle,
                backgroundColor: item.color,
                color: item.textColor || "#333",
                border: item.border || "none",
              }}
              onMouseEnter={(event) => (event.currentTarget.style.transform = "scale(0.99)")}
              onMouseLeave={(event) => (event.currentTarget.style.transform = "")}
            >
              <div>
                <h3 style={{ fontSize: "1.5rem", margin: "0 0 8px 0", fontWeight: 600 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "1rem", opacity: 0.7, margin: 0, lineHeight: 1.4 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          </GridItem>
        ))}

        <GridItem suffix span={{ xs: 2, md: 3, xl: 2 }}>
          <div
            style={{
              background: "var(--kui-color-primary)",
              color: "#fff",
              borderRadius: 24,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              fontWeight: 500,
              padding: 32,
              boxSizing: "border-box",
              cursor: "pointer",
            }}
          >
            <span>了解更多参数 →</span>
          </div>
        </GridItem>
      </Grid>
    </div>
  );
}
