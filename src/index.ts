import { Hono } from "hono";
import { NewPaymentAdapter, PaymentService } from "./adapter";
import { OrderApi } from "./chain-of-responsability";
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
import { PaymentApi } from "./template";

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

app.get("/chain-of-responsability", (c) => {
	const order = {
		id: 1,
		customerId: 100,
		items: [
			{ productId: 1, quantity: 2, price: 1500 },
			{ productId: 2, quantity: 1, price: 500 },
		],
	};

	new OrderApi().submitOrder(order);
	return c.json({});
});

app.get("/template", (c) => {
	const api = new PaymentApi();

	api.process({
		id: "P1",
		amount: 1200,
		method: "CREDIT_CARD",
		details: { cardNumber: "4111111111111111" },
	});
	return c.json({});
});

export default app;
