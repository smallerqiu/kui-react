import { TypographyText } from "react-kui";
export default function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
      <TypographyText>Default text</TypographyText>
      <TypographyText type="secondary">Secondary text</TypographyText>
      <TypographyText type="success">Success text</TypographyText>
      <TypographyText type="warning">Warning text</TypographyText>
      <TypographyText type="danger">Danger text</TypographyText>
      <TypographyText disabled>Disabled text</TypographyText>
    </div>
  );
}
