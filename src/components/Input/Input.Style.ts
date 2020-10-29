import { createStyle } from "~/utils";

const numberInputBtnStyle = createStyle({
  position: "absolute",
  zIndex: 1,
  width: "40px",
  height: "auto",
  textAlign: "center",
  background: "#f5f7fa",
  color: "#606266",
  cursor: "pointer",
  fontSize: "13px",
});

const styles = {
  numberInput: {
    container: createStyle({
      position: "relative",
      display: "inline-block",
      lineHeight: "38px",
      width: "180px",
      boxSizing: "border-box",
    }),
    disableBtn: createStyle({
      color: "#c0c4cc",
      cursor: "not-allowed",
    }),
    decreaseBtn: createStyle({
      ...numberInputBtnStyle,
      left: "1px",
      borderRadius: "4px 0 0 4px",
      border: "1px solid #dcdfe6",
      position: "absolute",
      boxSizing: "border-box",
    }),
    increaseBtn: createStyle({
      ...numberInputBtnStyle,
      right: "1px",
      borderRadius: "0 4px 4px 0",
      border: "1px solid #dcdfe6",
      position: "absolute",
      boxSizing: "border-box",
    }),
    btnIcon: createStyle({
      fontFamily: "normal",
      textTransform: "none",
      lineHeight: 1,
      verticalAlign: "baseline",
      display: "inline-block",
      userSelect: "none",
    }),
    input: createStyle({
      paddingLeft: "40px",
      paddingRight: "40px",
      textAlign: "center",
      width: "180px",
      boxSizing: "border-box",
    }),
    inputInner: createStyle({
      backgroundColor: "#fff",
      backgroundImage: "none",
      border: "1px solid #dcdfe6",
      boxSizing: "border-box",
      color: "#606266",
      display: "inline-block",
      fontSize: "inherit",
      height: "40px",
      lineHeight: "40px",
      outline: "none",
      padding: "0 15px",
      transition: "border-color .2s cubic-bezier(.645,.045,.355,1)",
      width: "100%",
    }),
  },
};

export default styles;
