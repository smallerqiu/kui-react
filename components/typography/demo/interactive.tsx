import { useState } from "react";
import { TypographyParagraph, TypographyText } from "react-kui";
export default function App() {
  const [text, setText] = useState("Click the edit icon to update this sentence.");
  const [copied, setCopied] = useState("");
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div>
        <TypographyText type="secondary">Copy</TypographyText>
        <TypographyParagraph
          copyable={{ tooltip: "Copy command", copiedTooltip: "Copied" }}
          onCopy={setCopied}
        >
          pnpm add react-kui
        </TypographyParagraph>
        {copied && <TypographyText type="success">Copied: {copied}</TypographyText>}
      </div>
      <div>
        <TypographyText type="secondary">Edit</TypographyText>
        <TypographyParagraph value={text} editable={{ tooltip: "Edit text" }} onChange={setText} />
        <TypographyText type="secondary">Current value: {text}</TypographyText>
      </div>
    </div>
  );
}
