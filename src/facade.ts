export type Customer = {
	id: number;
	name: string;
	email: string;
};

export type Product = {
	id: number;
	name: string;
	price: number;
};

export class CustomerService {
	getCustomerById(id: number): Customer {
		console.log(`Consultando cliente [${id}] no microsserviço de clientes`);
		return { id, name: `Cliente ${id}`, email: "email@example.com" };
	}
}

export class ProductService {
	getAvailableProducts(): Product[] {
		console.log("Buscando produtos disponíveis");
		return [
			{ id: 2, name: "Mouse Gamer", price: 250 },
			{ id: 3, name: "Teclado Mecânico", price: 600 },
		];
	}

	getProductById(id: number): Product | null {
		const products = this.getAvailableProducts();
		return products.find((p) => p.id === id) || null;
	}
}

export class OrderService {
	createOrder(customer: Customer, products: Product[]): number {
		console.log(`Criando pedido para ${customer.name}`);
		const orderId = Math.floor(Math.random() * 10000);
		console.log(`Pedido #${orderId} criado`);
		return orderId;
	}
}

export class PaymentService {
	processPayment(orderId: number, amount: number): boolean {
		console.log(`Processando pagamento do pedido #${orderId}, R$${amount}`);
		console.log("Pagamento aprovado!");
		return true;
	}
}

export class ECommerceFacade {
	private customerService = new CustomerService();
	private productService = new ProductService();
	private orderService = new OrderService();
	private paymentService = new PaymentService();

	placeOrder(customerId: number, productIds: number[]): void {
		console.log("\nIniciando fluxo de compra\n");

		const customer = this.customerService.getCustomerById(customerId);
		const products = productIds
			.map((id) => this.productService.getProductById(id))
			.filter((p): p is Product => !!p);

		if (products.length === 0) {
			console.log("Produto não encontrado!");
			return;
		}

		const total = products.reduce((sum, p) => sum + p.price, 0);
		const orderId = this.orderService.createOrder(customer, products);
		const paymentOk = this.paymentService.processPayment(orderId, total);

		if (paymentOk) {
			console.log(`Pedido #${orderId} concluído! Total: R$${total}`);
		} else {
			console.log(`⚠️ Pagamento do pedido #${orderId} falhou.\n`);
		}
	}

	listProducts(): void {
		const products = this.productService.getAvailableProducts();
		console.log("Produtos disponíveis:");
		products.forEach((p) => console.log(`- ${p.name} (R$${p.price})`));
	}
}
