export abstract class DiscountStrategy {
  abstract applyDiscount(amount: number, quantity?: number): number;
  abstract getDescription(): string;
}

export class NoDiscount extends DiscountStrategy {
  applyDiscount(amount: number): number {
    return amount;
  }

  getDescription(): string {
    return "Nenhum desconto aplicado";
  }
}

export class PercentageDiscount extends DiscountStrategy {
  constructor(private percentage: number) {
    super();
    if (percentage < 0 || percentage > 100) {
      throw new Error("Porcentagem deve ser entre 0 e 100");
    }
  }

  applyDiscount(amount: number): number {
    const discount = (amount * this.percentage) / 100;
    return amount - discount;
  }

  getDescription(): string {
    return `${this.percentage}% de desconto aplicado`;
  }
}
export class FixedAmountDiscount extends DiscountStrategy {
  constructor(private discountAmount: number) {
    super();
    if (discountAmount < 0) {
      throw new Error("Valor do desconto deve ser positivo");
    }
  }

  applyDiscount(amount: number): number {
    return Math.max(0, amount - this.discountAmount);
  }

  getDescription(): string {
    return `R$${this.discountAmount} de desconto aplicado`;
  }
}

export class Discount implements DiscountStrategy {
	private strategy: DiscountStrategy;

	constructor(strategy: DiscountStrategy) {
		this.strategy = strategy;
	}

	applyDiscount(amount: number): number {
		return this.strategy.applyDiscount(amount);
	}

	getDescription(): string {
		return this.strategy.getDescription();
	}

}
