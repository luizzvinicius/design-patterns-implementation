import { describe, expect, it } from "bun:test";
import { testClient } from "hono/testing";
import {
	EmailNotificationService,
	NOTIFICATION_TYPES,
	NotificationFactory,
	type NotificationType,
	PushNotificationService,
	SmsNotificationService,
} from ".";
import controller from "./controller";

const client = testClient(controller);

describe("Factory", () => {
	it("Should create a email notification service", async () => {
		const notificationService = NotificationFactory.createNotificationService(
			NOTIFICATION_TYPES.EMAIL,
		);
		expect(notificationService).toBeInstanceOf(EmailNotificationService);
	});

	it("Should create a sms notification service", async () => {
		const notificationService = NotificationFactory.createNotificationService(
			NOTIFICATION_TYPES.SMS,
		);
		expect(notificationService).toBeInstanceOf(SmsNotificationService);
	});

	it("Should create a push notification service", async () => {
		const notificationService = NotificationFactory.createNotificationService(
			NOTIFICATION_TYPES.PUSH,
		);
		expect(notificationService).toBeInstanceOf(PushNotificationService);
	});

	it("Should throw an error if the notification service is not supported", async () => {
		expect(() =>
			NotificationFactory.createNotificationService(
				"telegram" as NotificationType,
			),
		).toThrow("Tipo de notificação não suportado.");
	});

	it("Should send a email notification", async () => {
		const notificationService = NotificationFactory.createNotificationService(
			NOTIFICATION_TYPES.EMAIL,
		);
		const result = await notificationService.sendNotification(
			"test@test.com",
			"Test",
			"Test",
		);
		expect(result.success).toBe(true);
		expect(result.message).toBe("Email enviado com sucesso");
	});

	it("should send an email notification via the controller", async () => {
		const response = await client.index.$post({
			json: {
				type: NOTIFICATION_TYPES.EMAIL,
				subject: "Test",
				message: "Test",
				destination: "test@test.com",
			},
		});
		const result = await response.json();
		expect(result.status).toBe("success");
		expect(result.destination).toBe("test@test.com");
		expect(result.subject).toBe("Test");
	});
});
