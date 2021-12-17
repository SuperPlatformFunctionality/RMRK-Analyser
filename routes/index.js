import routerRmrk from "./routerRmrk.js";
import routerUser from "./routerUser.js";

export default app => {
	app.use("/rmrk2", routerRmrk);
	app.use("/user", routerUser);
}
