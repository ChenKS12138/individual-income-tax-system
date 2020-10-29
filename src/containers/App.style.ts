import { createStyle } from "~/utils";

const styles = {
  app: createStyle({
    marginTop: "20px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }),
  card: createStyle({
    minWidth: "70%",
  }),
};

export default styles;
