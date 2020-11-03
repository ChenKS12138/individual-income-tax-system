import React, { useCallback, useEffect, useState } from "react";

export function useConstraintArray(
  initArray: number[]
): [number[], (key: number, value: number) => void] {
  const [state, setState] = useState(initArray);

  const handleUpdate = useCallback(
    (key: number, value: number) => {
      if (state.length === 1) return;
      if (key < state.length) {
        const nextKey = (key + 1) % state.length;
        const nextValue = state[key] + state[nextKey] - value;
        const tmp = [...state];
        tmp[nextKey] = nextValue;
        tmp[key] = value;
        setState(tmp);
      }
    },
    [state, setState]
  );

  useEffect(() => {
    setState(initArray);
  }, [initArray]);

  return [state, handleUpdate];
}
