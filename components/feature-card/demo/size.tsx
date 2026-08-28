import { Zap } from "kui-icons";
import { FeatureCard, Space } from "react-kui";

const sizes = ["small", "medium", "large"] as const;

export default function App() {
  return (
    <Space vertical block size={12}>
      {sizes.map((size) => (
        <FeatureCard
          key={size}
          icon={Zap}
          size={size}
          title={`${size} card`}
          desc="Icon, spacing and typography scale together."
          theme="outline"
        />
      ))}
    </Space>
  );
}
