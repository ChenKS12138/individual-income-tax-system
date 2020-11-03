import React from "react";
import { CSSModule } from "typings/styles";
import styles from "./Card.style";

interface ICard {
  readonly children?: React.ReactNode;
  readonly style?: CSSModule.Style;
}

export default function Card({ children, style }: ICard) {
  return <div style={{ ...styles.container, ...style }}>{children}</div>;
}
