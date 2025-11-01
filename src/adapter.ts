export interface LegacyPaymentProcessor {
	processPayment(orderId: string, amount: number): void;
}

export class PaymentRequest {
	constructor(
		public transactionId: string,
		public totalAmount: number,
		public currency: string = "BRL",
	) {}
}

export class NewPaymentSystem {
	executePayment(request: PaymentRequest) {
		console.log("Processando pagamento");
		console.log(`ID: ${request.transactionId}`);
		console.log(`Valor: ${request.totalAmount} ${request.currency}`);
		console.log("Pagamento realizado com sucesso!\n");
	}
}

export class NewPaymentAdapter implements LegacyPaymentProcessor {
	private newSystem: NewPaymentSystem;

	constructor() {
		this.newSystem = new NewPaymentSystem();
	}

	processPayment(orderId: string, amount: number) {
		console.log("Convertendo chamada do sistema legado");

		const request = new PaymentRequest(orderId, amount, "BRL");

		this.newSystem.executePayment(request);
	}
}

export class PaymentService {
	constructor(private processor: LegacyPaymentProcessor) {}

	process(orderId: string, amount: number) {
		console.log(`Iniciando pagamento do pedido ${orderId}`);
		this.processor.processPayment(orderId, amount);
	}
}
