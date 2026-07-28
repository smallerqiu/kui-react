import { Watermark } from "react-kui";
export default function App() {
  return (
    <Watermark
      content="图片不可用时展示"
      image="https://cdn.chuchur.com/img/thumb.png"
      style={{ width: "100%", height: 500 }}
      width={150}
      height={50}
      gap={[100, 100]}
    />
  );
}
