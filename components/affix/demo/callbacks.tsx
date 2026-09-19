import { useState } from "react";
import { Button, Affix } from "react-kui";
export default function App() {
  const [fixed, setFixed] = useState(false);
  return (
    <>
      <p>Status: {fixed ? "fixed" : "reset"}</p>
      <Affix onChange={setFixed} offsetTop={200}>
        <Button type="primary">200px to affix top</Button>
      </Affix>
    </>
  );
}
