import { Carousel, CarouselItem } from "react-kui";
const itemStyle = {
  color: "#fff",
  background: "var(--kui-color-primary)",
  justifyContent: "center",
  alignItems: "center",
  fontSize: 30,
  fontWeight: 700,
  display: "flex",
} as const;
export default function App() {
  return (
    <Carousel vertical>
      {[1, 2, 3, 4].map((value) => (
        <CarouselItem key={value} style={itemStyle}>
          {value}
        </CarouselItem>
      ))}
    </Carousel>
  );
}
