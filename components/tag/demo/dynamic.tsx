import { Bookmark } from "kui-icons";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../button";
import Input from "../../input";
import Space from "../../space";
import Tag from "../index";
export default function Dynamic() {
  const [tags, setTags] = useState(["Apple", "Banana", "Cat", "Dog"]),
    [showInput, setShowInput] = useState(false),
    [tag, setTag] = useState(""),
    ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (showInput) ref.current?.focus();
  }, [showInput]);
  const add = () => {
    const value = tag.trim();
    if (value && !tags.includes(value)) setTags((items) => [...items, value]);
    setTag("");
    setShowInput(false);
  };
  return (
    <Space wrap>
      {tags.map((value) => (
        <Tag
          color="blue"
          closeable
          key={value}
          onClose={() => setTags((items) => items.filter((item) => item !== value))}
        >
          {value}
        </Tag>
      ))}
      {showInput ? (
        <Input
          ref={ref}
          value={tag}
          onChange={setTag}
          onBlur={add}
          onKeyDown={(e) => e.key === "Enter" && add()}
          size="small"
          style={{ width: 81 }}
        />
      ) : (
        <Button onClick={() => setShowInput(true)} size="small" icon={Bookmark}>
          New Tag
        </Button>
      )}
    </Space>
  );
}
