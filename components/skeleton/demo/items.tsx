import { useState } from "react";
import { Checkbox } from "../../checkbox";
import type { ShapeType, SizeType } from "../../const/types";
import { RadioGroup } from "../../radio";
import Slider from "../../slider";
import Space from "../../space";
import { SkeletonAvatar, SkeletonButton, SkeletonImage, SkeletonText } from "../index";
const sizes = [
    { label: "Small", value: "small" },
    { label: "Default", value: undefined },
    { label: "Large", value: "large" },
  ],
  btnShapes = [
    { label: "Round", value: "round" },
    { label: "Default", value: undefined },
    { label: "Circle", value: "circle" },
  ],
  avatarShapes = [
    { label: "Square", value: "square" },
    { label: "Circle", value: "circle" },
  ];
export default function Items() {
  const [animated, setAnimated] = useState(false),
    [block, setBlock] = useState(false),
    [size, setSize] = useState<SizeType | undefined>(),
    [btnShape, setBtnShape] = useState<ShapeType | undefined>("round"),
    [avatarShape, setAvatarShape] = useState<ShapeType>("square"),
    [radius, setRadius] = useState(10),
    [imgSize, setImgSize] = useState<number[]>([196, 96]);
  return (
    <>
      <Space size={15}>
        <Checkbox checked={animated} onChange={setAnimated} label="Animated" />
        <Checkbox checked={block} onChange={setBlock} label="Button block" />
        Size: <RadioGroup options={sizes} value={size} onChange={setSize} type="button" />
      </Space>
      <br />
      <br />
      <Space size={15}>
        Button Shape:{" "}
        <RadioGroup options={btnShapes} value={btnShape} onChange={setBtnShape} type="button" />
        Avatar Shape:{" "}
        <RadioGroup
          options={avatarShapes}
          value={avatarShape}
          onChange={setAvatarShape}
          type="button"
        />
      </Space>
      <br />
      <br />
      <Space size={15}>
        Image radius:{" "}
        <Slider value={radius} onChange={(v) => setRadius(v as number)} style={{ width: 300 }} />
      </Space>
      <br />
      <Space size={15}>
        Image Size:{" "}
        <Slider
          value={imgSize}
          onChange={(v) => setImgSize(v as number[])}
          range
          min={96}
          max={320}
          style={{ width: 300 }}
        />
      </Space>
      <br />
      <br />
      <Space>
        <SkeletonButton animated={animated} size={size} shape={btnShape} />
        <SkeletonAvatar animated={animated} size={size} shape={avatarShape} />
        <SkeletonText animated={animated} size={size} style={{ width: 200 }} />
      </Space>
      <br />
      <br />
      <SkeletonButton animated={animated} size={size} shape={btnShape} block={block} />
      <br />
      <br />
      <SkeletonImage animated={animated} radius={radius} size={imgSize} />
    </>
  );
}
