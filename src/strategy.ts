export abstract class DiscountStrategy {
	private strategy: string;

	constructor(strategy: string) {
		this.strategy = strategy;
	}

	abstract applyDiscount(amount: number): boolean;
	toString() {
		return this.strategy;
	}

	get getStrategy() {
		return this.strategy;
	}
}

export class PercentDiscount extends DiscountStrategy {
	constructor() {
		super("percent");
	}

	applyDiscount(amount: number): boolean {
		return true;
	}
}

export class TakeTwoPayOneDiscount extends DiscountStrategy {
	constructor() {
		super("twpo");
	}

	applyDiscount(amount: number): boolean {
		return true;
	}
}

export class Discount extends DiscountStrategy {
	private discountStrategy: DiscountStrategy;

	constructor(system: DiscountStrategy) {
		super(system.getStrategy);
		this.discountStrategy = system;
	}

	applyDiscount(amount: number): boolean {
		return this.discountStrategy.applyDiscount(amount);
	}
}
