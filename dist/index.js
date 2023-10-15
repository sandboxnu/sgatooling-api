"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const PORT = 8080;
const app = (0, utils_1.createServer)();
app.listen(PORT, () => console.log(`Local Host is running on PORT: ${PORT}`));
//# sourceMappingURL=index.js.map