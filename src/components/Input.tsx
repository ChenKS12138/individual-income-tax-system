import React, { useCallback } from "react";

interface IInput {
  value: number;
  onInput: (value: number) => void;
  id: string;
  type: "text";
}

export default function Input(props: IInput) {
  const handleInput = useCallback(
    (event) => {
      const newValue = event.target.value;
      event.target.value = props.value;
      const newEvent = {
        ...event,
        target: { ...event.target, value: newValue },
      };
      props.onInput && props.onInput(newEvent);
    },
    [props.value]
  );

  return <input {...props} onInput={handleInput} />;
}

function NumberInput(props: IInput) {
  const handleInput = useCallback(
    (event) => {
      const value = Number(event.target.value);
      if (!Number.isNaN(value)) {
        props.onInput(value);
      }
    },
    [props.onInput]
  );
  return <Input {...props} onInput={handleInput} />;
}

Input.Number = NumberInput;
