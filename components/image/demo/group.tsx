import { Space, ImageGroup, KImage } from "react-kui";
const data = [
  "https://cdn.chuchur.com/upload/cat/cat1.jpg",
  "https://cdn.chuchur.com/upload/cat/cat2.webp",
  "https://cdn.chuchur.com/upload/cat/cat3.webp",
  "https://cdn.chuchur.com/upload/cat/cat4.jpg",
  "https://cdn.chuchur.com/upload/cat/cat5---.jpg",
];
export default function App() {
  return (
    <Space vertical>
      <ImageGroup>
        {data.map((src) => (
          <KImage width={80} height={80} key={src} src={src} />
        ))}
      </ImageGroup>
      <code>Use group data</code>
      <ImageGroup data={data}>
        <KImage width={80} height={80} src="https://cdn.chuchur.com/upload/demo/test_300.jpg" />
      </ImageGroup>
    </Space>
  );
}
