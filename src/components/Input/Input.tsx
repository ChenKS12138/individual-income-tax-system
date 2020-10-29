import React, { useCallback } from "react";
import styles from "./Input.Style";

interface IInput {
  value: number;
  onInput: (value: number) => void;
  id: string;
  type: "text";
  // style: any;
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

interface INumberInput extends IInput {}

function NumberInput(props: INumberInput) {
  const handleInput = useCallback(
    (event) => {
      const value = Number(event.target.value);
      if (!Number.isNaN(value)) {
        props.onInput(value);
      }
    },
    [props.onInput]
  );
  // return (
  //   <div style={styles.numberInput.container}>
  //     <span style={styles.numberInput.decreaseBtn}>
  //       <i style={styles.numberInput.btnIcon}>{"-"}</i>
  //     </span>
  //     <span style={styles.numberInput.increaseBtn}>
  //       <i style={styles.numberInput.btnIcon}>{"+"}</i>
  //     </span>
  //     <div style={styles.numberInput.input}>
  //       <Input {...props} onInput={handleInput} />
  //     </div>
  //   </div>
  // );
  return <Input {...props} onInput={handleInput} />;
}

Input.Number = NumberInput;
