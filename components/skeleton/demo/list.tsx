import { useEffect, useRef, useState } from "react";
import { Avatar, Button, Space, Skeleton } from "react-kui";
const item = {
  name: "KUI Design",
  intro: "KUI is a desktop UI component library based on React",
  desc: "Dozens of useful and aesthetically pleasing components, a very user-friendly API suitable for developers of any skill level, and comprehensive documentation.",
};
export default function App() {
  const [loading, setLoading] = useState(false),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const reload = () => {
    setLoading(true);
    timer.current = setTimeout(() => setLoading(false), 3000);
  };
  return (
    <>
      <Button disabled={loading} onClick={reload}>
        Reload
      </Button>
      <br />
      <br />
      <div style={{ fontSize: 13 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{ padding: "15px 20px", borderBottom: "1px solid var(--kui-color-border)" }}
          >
            <Skeleton avatar loading={loading} rows={2} animated>
              <Space>
                <Avatar size="large">{item.name}</Avatar>
                <Space vertical align="start">
                  <h4 style={{ fontSize: 14, fontWeight: "bold", margin: 0 }}>{item.name}</h4>
                  <p style={{ color: "#999" }}>{item.intro}</p>
                </Space>
              </Space>
              <p style={{ margin: 0, lineHeight: "25px" }}>{item.desc}</p>
            </Skeleton>
          </div>
        ))}
      </div>
    </>
  );
}
