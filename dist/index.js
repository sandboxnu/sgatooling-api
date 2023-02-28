import express from "express";
import { membersRouter } from "./routes/members.js";
const PORT = 8080;
const app = express();
app.use(express.json());
app.use("/members", membersRouter);
app.listen(PORT, () => console.log(`Local Host is running on PORT: ${PORT}`));
//# sourceMappingURL=index.js.map