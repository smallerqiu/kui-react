import { TypographyParagraph, TypographyTitle } from "react-kui";
const text =
  "Good typography establishes hierarchy and rhythm. Titles introduce a topic, paragraphs make longer ideas comfortable to read, and inline styles draw attention only where it is needed.";
export default function App() {
  return (
    <div style={{ maxWidth: 520 }}>
      <TypographyTitle tag="h4">Single line</TypographyTitle>
      <TypographyParagraph ellipsis>{text}</TypographyParagraph>
      <TypographyTitle tag="h4">Two lines</TypographyTitle>
      <TypographyParagraph ellipsis={2}>{text}</TypographyParagraph>
      <TypographyTitle tag="h4">Expandable</TypographyTitle>
      <TypographyParagraph
        ellipsis={{
          rows: 2,
          expandable: true,
          expandText: "More",
          collapseText: "Collapse",
          tooltip: true,
        }}
      >
        {text} {text}
      </TypographyParagraph>
    </div>
  );
}
