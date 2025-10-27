import { Hono } from "hono";
import { validator } from "hono/validator";
import z from "zod";
import { validateWithSchema } from "../utils";
import { NotificationFactory } from ".";

const schema = z.object({
	type: z.enum(["email", "sms", "push"]),
	subject: z.string(),
	message: z.string(),
	destination: z.string(),
});

export default new Hono().post(
	"/",
	validator("json", (value) => validateWithSchema(schema, value)),
	async (c) => {
		const request = c.req.valid("json");

		const notificationService = NotificationFactory.createNotificationService(
			request.type,
		);

		notificationService.sendNotification(
			request.destination,
			request.subject,
			request.message,
		);

		return c.json({
			status: "success",
			destination: request.destination,
			subject: request.subject,
		});
	},
);
