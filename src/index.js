const app = require("./app");

app.listen(app.get("port"));
console.log("server working on port", app.get("port"));
