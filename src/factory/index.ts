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

export const NOTIFICATION_TYPES = {
	EMAIL: "email",
	SMS: "sms",
	PUSH: "push",
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

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


export class NotificationFactory {
	static createNotificationService(
		type: NotificationType,
	): NotificationService {
		let notificationService: NotificationService;
		switch (type) {
			case NOTIFICATION_TYPES.EMAIL:
				notificationService = new EmailNotificationService();
				break;
			case NOTIFICATION_TYPES.SMS:
				notificationService = new SmsNotificationService();
				break;
			case NOTIFICATION_TYPES.PUSH:
				notificationService = new PushNotificationService();
				break;
			default:
				throw new Error("Tipo de notificação não suportado.");
		}

		return notificationService;
	}
}
