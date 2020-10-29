import React, { useCallback, useMemo } from "react";
import { combineStyle, numberInRange } from "~utils";
import styles from "./Input.Style";

interface IInput {
  value: number;
  onInput: (value: number) => void;
  id: string;
  type: "text";
  style?: any;
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
    [props, props.value]
  );

  return <input {...props} onInput={handleInput} />;
}

interface INumberInput extends IInput {
  min?: number;
  max?: number;
}

function NumberInput(props: INumberInput) {
  const value = useMemo(
    () => numberInRange(props.value, props.min, props.max),
    [props, props.value, props.min, props.max]
  );

  const isDisableDecrease = useMemo(() => props.value <= props.min, [
    props,
    props.value,
    props.min,
  ]);

  const isDisableIncrease = useMemo(() => props.value >= props.max, [
    props,
    props.value,
    props.max,
  ]);

  const handleInput = useCallback(
    (event) => {
      const value = Number(event.target.value);
      if (!Number.isNaN(value)) {
        props.onInput(numberInRange(value, props.min, props.max));
      }
    },
    [props, props.onInput, props.min, props.max]
  );

  const handleDecrease = useCallback(() => {
    props.onInput(props.value - 1);
  }, [props, props.onInput]);

  const handleIncrease = useCallback(() => {
    props.onInput(props.value + 1);
  }, [props, props.onInput]);

  return (
    <div style={styles.numberInput.container}>
      <span
        onClick={isDisableDecrease ? null : handleDecrease}
        style={combineStyle([
          styles.numberInput.decreaseBtn,
          isDisableDecrease ? styles.numberInput.disableBtn : null,
        ])}
      >
        <span style={styles.numberInput.btnIcon}>{"-"}</span>
      </span>
      <span
        onClick={isDisableIncrease ? null : handleIncrease}
        style={combineStyle([
          styles.numberInput.increaseBtn,
          isDisableIncrease ? styles.numberInput.disableBtn : null,
        ])}
      >
        <span style={styles.numberInput.btnIcon}>{"+"}</span>
      </span>
      <div style={styles.numberInput.input}>
        <Input
          {...props}
          value={value}
          style={styles.numberInput.inputInner}
          onInput={handleInput}
        />
      </div>
    </div>
  );
}

Input.Number = NumberInput;
