import { Hono } from "hono";
import factoryController from "./factory/controller";
import { StockMarket } from "./observer";
import { getLog } from "./singleton";

const app = new Hono();

app.get("/singleton", (c) => {
	getLog().loggin("teste", "warn");
	return c.text(getLog().logs.toString());
});

app.get("/singleton/logs", (c) => {
	const logs = getLog().logs.reverse();
	return c.json({ recentLogs: logs });
});

app.route("/factory", factoryController);

app.get("/observer", (c) => {
	const market = new StockMarket();

	market.subscribe("changeprice", "listener1");
	market.subscribe("changeprice2", "listener1");
	market.subscribe("changeprice", "listener2");
	market.notify("changeprice", "");
	market.notify("changeprice2", "");

	return c.json("consultar terminal");
});

export default app;
