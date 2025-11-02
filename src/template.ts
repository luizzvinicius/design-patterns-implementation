export interface PaymentInfo {
	id: string;
	amount: number;
	method: "CREDIT_CARD" | "PAYPAL" | "BANK_TRANSFER";
	details: Record<string, unknown>;
}

export abstract class PaymentProcessor {
	processPayment(info: PaymentInfo): void {
		console.log(`\nIniciando processamento do pagamento #${info.id}`);
		this.validate(info);
		this.executePayment(info);
		this.sendNotification(info);
		console.log(`Pagamento #${info.id} concluído com sucesso!\n`);
	}

	protected abstract validate(info: PaymentInfo): void;
	protected abstract executePayment(info: PaymentInfo): void;

	protected sendNotification(info: PaymentInfo): void {
		console.log(
			`Enviando notificação de pagamento [${info.id}] para o cliente.`,
		);
	}
}

export class CreditCardProcessor extends PaymentProcessor {
	protected validate(info: PaymentInfo): void {
		console.log("Validando dados do cartão");
		if (!info.details.cardNumber) throw new Error("Número do cartão ausente!");
	}

	protected executePayment(info: PaymentInfo): void {
		console.log(
			`Processando pagamento via cartão de crédito no valor de R$${info.amount.toFixed(2)}`,
		);
	}

	protected sendNotification(info: PaymentInfo): void {
		console.log(
			"Enviando e-mail de confirmação do pagamento com cartão de crédito.",
		);
	}
}

export class PayPalProcessor extends PaymentProcessor {
	protected validate(info: PaymentInfo): void {
		console.log("Validando conta PayPal");
		if (!info.details.email) throw new Error("E-mail do PayPal ausente!");
	}

	protected executePayment(info: PaymentInfo): void {
		console.log(
			`Enviando transação PayPal para ${info.details.email}, valor R$${info.amount}`,
		);
	}

	protected sendNotification(info: PaymentInfo): void {
		console.log("Notificação enviada via PayPal app.");
	}
}

export class BankTransferProcessor extends PaymentProcessor {
	protected validate(info: PaymentInfo): void {
		console.log("Validando dados bancários");
		if (!info.details.account) throw new Error("Conta bancária não informada!");
	}

	protected executePayment(info: PaymentInfo): void {
		console.log(
			`Transferindo R$${info.amount} para a conta ${info.details.account}`,
		);
	}
}

export class PaymentApi {
	private getProcessor(method: string): PaymentProcessor {
		switch (method) {
			case "CREDIT_CARD":
				return new CreditCardProcessor();
			case "PAYPAL":
				return new PayPalProcessor();
			case "BANK_TRANSFER":
				return new BankTransferProcessor();
			default:
				throw new Error(`Método de pagamento inválido: ${method}`);
		}
	}

	process(info: PaymentInfo): void {
		const processor = this.getProcessor(info.method);
		processor.processPayment(info);
	}
}
