import { Hono } from "hono";
import factoryController from "./factory/controller";
import { StockMarket } from "./observer";
import { getLog } from "./singleton";
import {
	Discount,
	type DiscountStrategy,
	PercentDiscount,
	TakeTwoPayOneDiscount,
} from "./strategy";

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

app.get("/strategy", (c) => {
	const amount = Math.round(Math.random() * 100);
	const percent = new PercentDiscount();
	const twpo = new TakeTwoPayOneDiscount();
	let discountStrategy: DiscountStrategy | null;

	discountStrategy = percent;
	if (amount % 2 === 0) {
		discountStrategy = twpo;
	}

	const discount = new Discount(discountStrategy);
	discount.applyDiscount(30);

	return c.json({ recentLogs: discount.toString() });
});

export default app;
