import { describe, expect, it } from "bun:test";
import {
	Discount,
	type DiscountStrategy,
	FixedAmountDiscount,
	NoDiscount,
	PercentageDiscount,
} from "./index";

describe("Strategy Pattern - Discount Strategies", () => {
	it("should apply no discount and return original amount", () => {
		const noDiscount = new NoDiscount();
		expect(noDiscount.applyDiscount(100)).toBe(100);
		expect(noDiscount.getDescription()).toBe("Nenhum desconto aplicado");
	});

	it("should apply percentage discount correctly", () => {
		const discount20 = new PercentageDiscount(20);
		expect(discount20.applyDiscount(100)).toBe(80);
		expect(discount20.applyDiscount(99.99)).toBeCloseTo(79.99, 2);
		expect(discount20.getDescription()).toBe("20% de desconto aplicado");
	});

	it("should validate percentage discount range (0-100)", () => {
		expect(() => new PercentageDiscount(-10)).toThrow(
			"Porcentagem deve ser entre 0 e 100",
		);
		expect(() => new PercentageDiscount(150)).toThrow(
			"Porcentagem deve ser entre 0 e 100",
		);
		expect(new PercentageDiscount(0).applyDiscount(100)).toBe(100);
		expect(new PercentageDiscount(100).applyDiscount(100)).toBe(0);
	});

	it("should apply fixed amount discount correctly", () => {
		const discount25 = new FixedAmountDiscount(25);
		expect(discount25.applyDiscount(100)).toBe(75);
		expect(discount25.applyDiscount(99.99)).toBe(74.99);
		expect(discount25.getDescription()).toBe("R$25 de desconto aplicado");
	});

	it("should validate fixed discount is not negative", () => {
		expect(() => new FixedAmountDiscount(-10)).toThrow(
			"Valor do desconto deve ser positivo",
		);
	});

	it("should not return negative amounts for fixed discount", () => {
		const discount50 = new FixedAmountDiscount(50);
		expect(discount50.applyDiscount(30)).toBe(0);
		expect(discount50.applyDiscount(100)).toBe(50);
	});

	it("should use percentage strategy via Discount context", () => {
		const discount = new Discount(new PercentageDiscount(15));
		expect(discount.applyDiscount(100)).toBe(85);
		expect(discount.getDescription()).toBe("15% de desconto aplicado");
	});

	it("should use fixed amount strategy via Discount context", () => {
		const discount = new Discount(new FixedAmountDiscount(20));
		expect(discount.applyDiscount(100)).toBe(80);
		expect(discount.getDescription()).toBe("R$20 de desconto aplicado");
	});

	it("should work with different strategies polymorphically", () => {
		const strategies: DiscountStrategy[] = [
			new NoDiscount(),
			new PercentageDiscount(10),
			new FixedAmountDiscount(10),
		];

		expect(strategies[0].applyDiscount(100)).toBe(100);
		expect(strategies[1].applyDiscount(100)).toBe(90);
		expect(strategies[2].applyDiscount(100)).toBe(90);
	});

	it("should allow switching strategies at runtime", () => {
		let discount = new Discount(new NoDiscount());
		expect(discount.applyDiscount(100)).toBe(100);

		discount = new Discount(new PercentageDiscount(20));
		expect(discount.applyDiscount(100)).toBe(80);

		discount = new Discount(new FixedAmountDiscount(30));
		expect(discount.applyDiscount(100)).toBe(70);
	});

	it("should compare different strategies on same amount", () => {
		const amount = 100;
		const strategies = [
			new NoDiscount(),
			new PercentageDiscount(15),
			new FixedAmountDiscount(20),
		];

		const savings = strategies.map(
			(s) => amount - s.applyDiscount(amount),
		);

		expect(savings).toEqual([0, 15, 20]);
	});

	it("should handle edge cases (zero, large, and decimal amounts)", () => {
		const percentDiscount = new PercentageDiscount(20);
		const fixedDiscount = new FixedAmountDiscount(10);

		// Zero amounts
		expect(percentDiscount.applyDiscount(0)).toBe(0);
		expect(fixedDiscount.applyDiscount(0)).toBe(0);

		// Large amounts
		expect(percentDiscount.applyDiscount(1000000)).toBe(800000);

		// Small decimals
		expect(percentDiscount.applyDiscount(0.01)).toBeCloseTo(0.008, 4);
	});
});