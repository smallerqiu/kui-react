import clsx from "clsx";
import { useCallback, useEffect, useState, type HTMLAttributes } from "react";

export interface RollUpProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  duration?: number;
  precision?: number;
}

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function RollUp({
  value,
  duration = 1.2,
  precision = 0,
  className,
  ...rest
}: RollUpProps) {
  const current = value ?? 0;
  const format = useCallback(
    (number: number) =>
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      })
        .format(number)
        .split(""),
    [precision],
  );
  const offset = (number: number) =>
    format(number).map((character) =>
      /\d/.test(character)
        ? String(Number(character) > 5 ? Number(character) - 5 : Number(character) + 5)
        : character,
    );
  const [characters, setCharacters] = useState(() => offset(current));
  const syncKey = `${current}:${precision}`;
  const [previousSyncKey, setPreviousSyncKey] = useState(syncKey);
  if (previousSyncKey !== syncKey) {
    setPreviousSyncKey(syncKey);
    setCharacters(offset(current));
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => setCharacters(format(current)));
    return () => cancelAnimationFrame(frame);
  }, [current, format]);

  return (
    <div {...rest} className={clsx("k-stat-roll-number-container", className)}>
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
              {numbers.map((number) => (
                <span key={number}>{number}</span>
              ))}
            </div>
          ) : (
            <span className="k-stat-roll-number-separator">{character}</span>
          )}
        </div>
      ))}
    </div>
  );
}
