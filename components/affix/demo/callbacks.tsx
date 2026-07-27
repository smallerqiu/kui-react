import { useState } from "react";
import { Button } from "../../button";
import Affix from "../index";
export default function Callbacks() {
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
