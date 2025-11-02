import { Hono } from "hono";
import { NewPaymentAdapter, PaymentService } from "./adapter";
import {
	CsvDataExporter,
	JsonDataExporter,
	XmlDataExporter,
} from "./decorator";
import { ECommerceFacade } from "./facade";
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

app.get("/adapter", (c) => {
	const adapter = new NewPaymentAdapter();
	const paymentService = new PaymentService(adapter);

	paymentService.process("ORDER-123", 250.75);
	paymentService.process("ORDER-456", 99.9);

	return c.json({});
});

app.get("/decorator", (c) => {
	const data = {
		id: 1,
		name: "Planilha básica",
		extension: "csv",
	};

	new JsonDataExporter().export(data);
	new XmlDataExporter().export(data);
	new CsvDataExporter().export(data);

	return c.json({});
});

app.get("/facade", (c) => {
	const ecommerce = new ECommerceFacade();

	ecommerce.listProducts();

	ecommerce.placeOrder(1, [1, 3]);
	return c.json({});
});

export default app;
