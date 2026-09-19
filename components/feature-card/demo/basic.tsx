import { Palette, Zap } from "kui-icons";
import { FeatureCard, Grid } from "react-kui";

export default function App() {
  return (
    <Grid cols={2} xGap={16}>
      <FeatureCard
        icon={Zap}
        title="开箱即用"
        desc="简洁的 API 与完善的 TypeScript 类型，让开发过程更高效。"
      />
      <FeatureCard
        icon={Palette}
        title="灵活主题"
        desc="通过设计变量快速调整品牌色彩与组件视觉风格。"
      />
    </Grid>
  );
}
