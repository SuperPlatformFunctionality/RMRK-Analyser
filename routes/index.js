const routerRmrk = require("./routerRmrk.js");
const routerUser = require("./routerUser.js");

module.exports = app => {
	app.use("/rmrk2", routerRmrk);
	app.use("/user", routerUser);
}
