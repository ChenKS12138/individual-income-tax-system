import { createStyle } from "~/utils";

const styles = {
  container: createStyle({
    position: "relative",
  }),
  canvas: createStyle({
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  }),
  textY: createStyle({
    position: "absolute",
    top: 0,
    transform: " translateX(-100%)",
  }),
  textX: createStyle({
    position: "absolute",
    bottom: "0",
    right: "0",
    transform: "translateY(100%)",
  }),
};

export default styles;
