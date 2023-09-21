import { createServer } from "./utils";

const PORT = 8080;
const app = createServer();

app.listen(PORT, () => console.log(`Local Host is running on PORT: ${PORT}`));
