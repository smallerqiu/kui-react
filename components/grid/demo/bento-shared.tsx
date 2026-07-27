import { Grid, GridItem } from "../index";
import "./demo.css";
const features = [
  [4, 3, "M3 Max Chip"],
  [2, 2, "Extended Battery Life"],
  [2, 1, "5G Ultra Speed"],
  [4, 2, "Retina Display"],
  [2, 2, "Privacy Protection"],
  [2, 1, "Multi-device Collaboration"],
] as const;
export default function BentoShared({ zh = false }: { zh?: boolean }) {
  return (
    <div>
      <h2>{zh ? "技术规格矩阵" : "Technical Specifications Matrix"}</h2>
      <Grid
        cols={{ xs: 2, md: 6, xl: 8 }}
        xGap={20}
        yGap={20}
        autoRows="90px"
        style={{ gridAutoFlow: "dense" }}
      >
        {features.map(([span, row, title], i) => (
          <GridItem key={title} span={{ xs: i === 0 ? 2 : 1, md: 3, xl: span }} rowSpan={row}>
            <div className="grid-bento-card">
              <h3>
                {zh
                  ? [
                      "自研芯片 M3 Max",
                      "超长续航",
                      "5G 超高速",
                      "Retina 显示屏",
                      "隐私保护",
                      "多设备协作",
                    ][i]
                  : title}
              </h3>
              <p>
                {zh
                  ? "响应式网格布局，自动适应不同屏幕。"
                  : "Responsive grid layout for every screen."}
              </p>
            </div>
          </GridItem>
        ))}
        <GridItem suffix span={{ xs: 2, md: 3, xl: 2 }}>
          <div className="grid-bento-card">{zh ? "了解更多参数 →" : "Learn more →"}</div>
        </GridItem>
      </Grid>
    </div>
  );
}
