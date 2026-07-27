import { useEffect, useRef, useState } from "react";
import { Button } from "../../button";
import Card from "../../card";
import { SkeletonImage, SkeletonText } from "../index";
export default function Custom() {
  const [loading, setLoading] = useState(false),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
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
      {[1, 2, 3].map((x) => (
        <Card
          key={x}
          title="A Poem"
          style={{ width: 200, marginBottom: 10, display: "inline-block", marginRight: 20 }}
        >
          <SkeletonImage animated loading={loading} radius={8} style={{ width: 166, height: 100 }}>
            <div
              style={{
                height: 100,
                width: 166,
                borderRadius: 8,
                background:
                  'url("https://cdn.chuchur.com/upload/demo/test_300.jpg") no-repeat center/cover',
              }}
            />
          </SkeletonImage>
          <SkeletonText
            animated
            loading={loading}
            size="small"
            style={{ minWidth: 80, margin: "8px 0" }}
          >
            <p>Tony Stark</p>
          </SkeletonText>
          <SkeletonText animated loading={loading} size="small" style={{ minWidth: 130 }}>
            <span style={{ fontSize: 13, color: "#999" }}>I am Iron Man.</span>
          </SkeletonText>
        </Card>
      ))}
    </>
  );
}
