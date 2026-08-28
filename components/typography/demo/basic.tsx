import { TypographyParagraph, TypographyText, TypographyTitle } from "react-kui";
export default function App() {
  return (
    <>
      <TypographyTitle tag="h2">Typography makes content easier to scan</TypographyTitle>
      <TypographyParagraph>
        A clear visual hierarchy helps readers find the title, understand the summary, and then move
        through the details at their own pace.
      </TypographyParagraph>
      <TypographyParagraph type="secondary">
        Use semantic components instead of styling every piece of text independently.
      </TypographyParagraph>
      <TypographyText>Kui React Design · Typography</TypographyText>
    </>
  );
}
