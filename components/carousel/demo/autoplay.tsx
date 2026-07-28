import { useRef } from "react";
import { Button, Space, Carousel, CarouselItem, type CarouselRef } from "react-kui";
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
  const carouselRef = useRef<CarouselRef>(null);
  return (
    <div>
      <Space>
        <Button onClick={() => carouselRef.current?.goTo(2)}>goTo 2</Button>
        <Button onClick={() => carouselRef.current?.prev()}>Prev</Button>
        <Button onClick={() => carouselRef.current?.next()}>Next</Button>
      </Space>
      <br />
      <br />
      <Carousel autoplay loop ref={carouselRef}>
        {[1, 2, 3, 4].map((value) => (
          <CarouselItem key={value} style={itemStyle}>
            {value}
          </CarouselItem>
        ))}
      </Carousel>
    </div>
  );
}
