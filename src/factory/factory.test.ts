import { describe, expect, it } from "bun:test";
import { testClient } from "hono/testing";
import {
	EmailNotificationService,
	NotificationFactory,
	type NotificationType,
	PushNotificationService,
	SmsNotificationService,
} from ".";
import controller from "./controller";

const client = testClient(controller);

describe("Factory", () => {
	it("Should create a email notification service", async () => {
		const notificationService =
			NotificationFactory.createNotificationService("email");
		expect(notificationService).toBeInstanceOf(EmailNotificationService);
	});

	it("Should create a sms notification service", async () => {
		const notificationService =
			NotificationFactory.createNotificationService("sms");
		expect(notificationService).toBeInstanceOf(SmsNotificationService);
	});

	it("Should create a push notification service", async () => {
		const notificationService =
			NotificationFactory.createNotificationService("push");
		expect(notificationService).toBeInstanceOf(PushNotificationService);
	});

	it("Should throw an error if the notification service is not supported", async () => {
		expect(() =>
			NotificationFactory.createNotificationService(
				"invalid" as NotificationType,
			),
		).toThrow("Tipo de notificação não suportado.");
	});

	it("Should send a email notification", async () => {
		const notificationService =
			NotificationFactory.createNotificationService("email");
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
        type: "email",
        subject: "Test",
        message: "Test",
        destination: "test@test.com",
      }
    });
    const result = await response.json();
    console.log(result);
    expect(result.status).toBe("success");
    expect(result.destination).toBe("test@test.com");
    expect(result.subject).toBe("Test");
  });
});
