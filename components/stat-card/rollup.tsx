import { useEffect, useState, type HTMLAttributes } from "react";

export interface RollUpProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  modelValue?: number;
  duration?: number;
  precision?: number;
}

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function RollUp({
  value,
  modelValue,
  duration = 1.2,
  precision = 0,
  className,
  ...rest
}: RollUpProps) {
  const current = value ?? modelValue ?? 0;
  const format = (number: number) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    })
      .format(number)
      .split("");
  const offset = (number: number) =>
    format(number).map((character) =>
      /\d/.test(character) ? String(Number(character) > 5 ? Number(character) - 5 : Number(character) + 5) : character,
    );
  const [characters, setCharacters] = useState(() => offset(current));

  useEffect(() => {
    setCharacters(offset(current));
    const frame = requestAnimationFrame(() => setCharacters(format(current)));
    return () => cancelAnimationFrame(frame);
  }, [current, precision]);

  return (
    <div {...rest} className={["k-stat-roll-number-container", className].filter(Boolean).join(" ")}>
      {characters.map((character, index) => (
        <div key={index} className="k-stat-roll-number-slot">
          {/\d/.test(character) ? (
            <div
              className="k-stat-roll-number-column"
              style={{
                transition: `transform ${duration * 1000}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                transform: `translateY(-${Number(character) * 10}%)`,
                willChange: "transform",
              }}
            >
              {numbers.map((number) => <span key={number}>{number}</span>)}
            </div>
          ) : <span className="k-stat-roll-number-separator">{character}</span>}
        </div>
      ))}
    </div>
  );
}
