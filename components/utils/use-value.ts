import { useCallback, useState, type Dispatch, type SetStateAction } from "react";

// User edits stay local until the parent supplies a different value.
// Compare the source before normalization so freshly created fallback arrays don't reset edits.
export function useValue<Source, Value>(
  source: Source,
  normalize: (source: Source) => Value,
): [Value, Dispatch<SetStateAction<Value>>] {
  const [state, setState] = useState(() => ({ source, value: normalize(source) }));
  let current = state.value;
  if (!Object.is(state.source, source)) {
    current = normalize(source);
    setState({ source, value: current });
  }
  const setValue = useCallback<Dispatch<SetStateAction<Value>>>((action) => {
    setState((previous) => ({
      ...previous,
      value:
        typeof action === "function" ? (action as (value: Value) => Value)(previous.value) : action,
    }));
  }, []);
  return [current, setValue];
}
