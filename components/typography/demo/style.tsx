import { TypographyText } from "react-kui";
export default function App() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 24px" }}>
      <TypographyText strong>Strong</TypographyText>
      <TypographyText italic>Italic</TypographyText>
      <TypographyText underline>Underline</TypographyText>
      <TypographyText delete>Deleted</TypographyText>
      <TypographyText mark>Marked</TypographyText>
      <TypographyText code>pnpm add react-kui</TypographyText>
      <TypographyText strong italic underline>
        Combined styles
      </TypographyText>
    </div>
  );
}
