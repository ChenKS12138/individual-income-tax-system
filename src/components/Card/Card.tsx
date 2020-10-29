import React from "react";
import styles from "./Card.style";

interface ICard {
  children?: React.ReactNode;
}

export default function Card({ children }: ICard) {
  return <div style={styles.container}>{children}</div>;
}
