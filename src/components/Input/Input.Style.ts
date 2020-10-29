import { createStyle } from "~/utils";

const styles = {
  numberInput: {
    container: createStyle({
      position: "relative",
      display: "inline-block",
      lineHeight: "38px",
    }),
    disableBtn: createStyle({
      color: "#c0c4cc",
      cursor: "not-allowed",
    }),
    decreaseBtn: createStyle({
      left: "1px",
      borderRadius: "4px 0 0 4px",
      borderRight: "1px solid #dcdfe6",
      position: "absolute",
    }),
    increaseBtn: createStyle({
      right: "1px",
      borderRadius: "0 4px 4xp 0",
      borderLeft: "1px solid #dcdfe6",
      position: "absolute",
    }),
    btnIcon: createStyle({
      fontFamily: "normal",
      textTransform: "none",
      lineHeight: 1,
      verticalAlign: "baseline",
      display: "inline-block",
    }),
    input: createStyle({
      paddingLeft: "50px",
      paddingRight: "50px",
      textAlign: "center",
      width: "180px",
    }),
  },
};

export default styles;
