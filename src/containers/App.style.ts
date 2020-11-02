import { createStyle } from "~/utils";

const styles = {
  app: createStyle({
    marginTop: "20px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }),
  title: createStyle({
    textAlign: "center",
  }),
  card: createStyle({
    minWidth: "70%",
  }),
  formItem: createStyle({
    marginBottom: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  }),
  result: {
    container: createStyle({
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
    }),
    graph: createStyle({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }),
  },
};

export default styles;
