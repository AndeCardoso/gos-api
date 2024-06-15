// require("module-alias/register");
import "dotenv/config";
import { app } from "./app";

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`GOS is working at port: ${port}`);
});
