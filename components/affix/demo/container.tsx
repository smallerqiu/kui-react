import { useCallback, useRef } from "react";
import { Affix, Button } from "react-kui";
export default function App() {
  const ref = useRef<HTMLDivElement>(null);
  const target = useCallback(() => ref.current, []);
  return (
    <div
      ref={ref}
      style={{
        height: 300,
        overflowY: "scroll",
        backgroundImage:
          "linear-gradient(-45deg, #cdcdcd 25%, #eeeeee50 0),linear-gradient(45deg, #cdcdcd 25%, #eeeeee50 0),    linear-gradient(-45deg, #eeeeee50 75%, #cdcdcd 0),    linear-gradient(45deg, #eeeeee50 75%, #cdcdcd 0)",
        backgroundSize: "40px 40px",
        backgroundPosition: "0 0,0 -20px,-20px 20px,20px 0",
      }}
    >
      <div style={{ height: 800, paddingTop: 50 }}>
        <Affix target={target} offsetTop={50}>
          <Button type="primary">Affix at container top</Button>
        </Affix>
        <div style={{ height: 500 }} />
        <Affix target={target} offsetBottom={50}>
          <Button type="primary">Affix at container bottom</Button>
        </Affix>
      </div>
    </div>
  );
}
