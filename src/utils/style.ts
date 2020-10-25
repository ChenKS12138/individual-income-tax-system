import { CSSModule } from "typings/styles";

export function createStyle(style: CSSModule.Style): { [key: string]: string } {
  return style as any;
}
