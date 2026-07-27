import { Watermark } from "react-kui";
export default function Basic() {
  return (
    <div className="salary-card" style={{ width: "100%", height: 500 }}>
      <Watermark content="Kui React" font={{ color: "rgba(100, 100, 100, 0.3)" }} />
    </div>
  );
}
