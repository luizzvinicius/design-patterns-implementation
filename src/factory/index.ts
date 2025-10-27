interface NotificationResult {
	success: boolean;
	message: string;
}

export interface NotificationService {
	sendNotification(
		destination: string,
		subject: string,
		content: string,
	): Promise<NotificationResult>;
}

export class EmailNotificationService implements NotificationService {
	async sendNotification(
		destination: string,
		subject: string,
		content: string,
	): Promise<NotificationResult> {
		console.log(`Enviando EMAIL para ${destination}`);
		console.log(`Assunto: ${subject}`);
		console.log(`Conteúdo: ${content}`);
		return { success: true, message: "Email enviado com sucesso" };
	}
}

export class SmsNotificationService implements NotificationService {
	async sendNotification(
		destination: string,
		subject: string,
		content: string,
	): Promise<NotificationResult> {
		console.log(`Enviando SMS para ${destination}`);
		console.log(`Mensagem: ${subject} - ${content}`);
		return { success: true, message: "SMS enviado com sucesso" };
	}
}

export class PushNotificationService implements NotificationService {
	async sendNotification(
		destination: string,
		subject: string,
		content: string,
	): Promise<NotificationResult> {
		console.log(`Enviando PUSH para ${destination}`);
		console.log(`Título: ${subject}`);
		console.log(`Mensagem: ${content}`);
		return { success: true, message: "Push enviado com sucesso" };
	}
}

export type NotificationType = "email" | "sms" | "push";

export class NotificationFactory {
	static createNotificationService(
		type: NotificationType,
	): NotificationService {
		let notificationService: NotificationService;
		switch (type) {
			case "email":
				notificationService = new EmailNotificationService();
				break;
			case "sms":
				notificationService = new SmsNotificationService();
				break;
			case "push":
				notificationService = new PushNotificationService();
				break;
			default:
				throw new Error("Tipo de notificação não suportado.");
		}

		return notificationService;
	}
}
