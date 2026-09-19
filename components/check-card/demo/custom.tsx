import { LogoApple, LogoMicrosoft } from "kui-icons";
import { useState } from "react";
import { CheckCard, CheckCardGroup } from "react-kui";

export default function App() {
  const [platform, setPlatform] = useState("apple");
  return (
    <CheckCardGroup value={platform} onChange={(next) => setPlatform(String(next))}>
      <CheckCard value="apple" title="Apple" description="macOS 与 iOS" symbol={LogoApple} />
      <CheckCard
        value="microsoft"
        title="Microsoft"
        description="Windows 与 Azure"
        symbol={LogoMicrosoft}
      />
    </CheckCardGroup>
  );
}
