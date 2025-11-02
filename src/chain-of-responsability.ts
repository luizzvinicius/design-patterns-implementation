export type Order = {
	id: number;
	customerId: number;
	items: { productId: number; quantity: number; price: number }[];
	total?: number;
	discount?: number;
	status?: string;
};

export interface OrderHandler {
	setNext(handler: OrderHandler): OrderHandler;
	handle(order: Order): Order;
}

export abstract class BaseOrderHandler implements OrderHandler {
	private nextHandler?: OrderHandler;

	handle(order: Order): Order {
		if (this.nextHandler) {
			return this.nextHandler.handle(order);
		}
		return order;
	}

	setNext(handler: OrderHandler): OrderHandler {
		this.nextHandler = handler;
		return handler;
	}
}

export class InventoryValidator extends BaseOrderHandler {
	handle(order: Order): Order {
		console.log("Verificando estoque");
		const hasStock = order.items.every((item) => item.quantity <= 10);

		if (!hasStock) {
			console.log("Estoque insuficiente!");
			order.status = "REJECTED - Out of stock";
			return order;
		}

		console.log("Estoque verificado com sucesso.");
		return super.handle(order);
	}
}

export class FraudDetector extends BaseOrderHandler {
	handle(order: Order): Order {
		console.log("Verificando fraude");
		const isFraud = order.total && order.total > 10000;

		if (isFraud) {
			console.log("Pedido suspeito de fraude!");
			order.status = "REJECTED - Fraud detected";
			return order;
		}

		console.log("Nenhuma fraude detectada.");
		return super.handle(order);
	}
}

export class PricingCalculator extends BaseOrderHandler {
	handle(order: Order): Order {
		console.log("Calculando preço total");
		const total = order.items.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0,
		);
		order.total = total;
		console.log(`Total calculado: R$${total}`);
		return super.handle(order);
	}
}

export class DiscountApplier extends BaseOrderHandler {
	handle(order: Order): Order {
		console.log("Aplicando descontos");
		if (order.total && order.total > 2000) {
			order.discount = order.total * 0.1;
			order.total -= order.discount;
			console.log(`Desconto de 10% aplicado! Novo total: R$${order.total}`);
		} else {
			console.log("ℹNenhum desconto aplicado");
		}
		return super.handle(order);
	}
}

export class OrderPersister extends BaseOrderHandler {
	handle(order: Order): Order {
		console.log("Salvando pedido no banco de dados");
		order.status = "COMPLETED";
		console.log(`Pedido #${order.id} salvo com status ${order.status}`);
		return order;
	}
}

export class OrderProcessingChain {
	private chainStart: InventoryValidator;

	constructor() {
		const inventory = new InventoryValidator();
		const pricing = new PricingCalculator();
		const discount = new DiscountApplier();
		const fraud = new FraudDetector();
		const persister = new OrderPersister();

		inventory
			.setNext(pricing)
			.setNext(discount)
			.setNext(fraud)
			.setNext(persister);

		this.chainStart = inventory;
	}

	process(order: Order): Order {
		console.log("\nIniciando processamento do pedido\n");
		const result = this.chainStart.handle(order);
		console.log("\nProcessamento concluído!\n");
		return result;
	}
}

export class OrderApi {
	private chain = new OrderProcessingChain();

	submitOrder(order: Order): void {
		const result = this.chain.process(order);
		console.log("Resultado final:", result);
	}
}
