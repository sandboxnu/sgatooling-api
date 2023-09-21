"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_js_1 = require("./utils.js");
/*
const attendances = require("./routes/attendanceRoutes.js");
*/
const PORT = 8080;
const app = (0, utils_js_1.createServer)();
app.listen(PORT, () => console.log(`Local Host is running on PORT: ${PORT}`));
//# sourceMappingURL=index.js.map