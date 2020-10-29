import { CSSModule } from "typings/styles";

export function createStyle(style: CSSModule.Style): { [key: string]: string } {
  return style as any;
}

export function combineStyle(styles: CSSModule.Style[]): CSSModule.Style {
  return styles.reduce((prev, current) => ({ ...prev, ...current }), {});
}
