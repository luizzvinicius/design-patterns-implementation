export interface NotificationService {
  sendNotification(destination: string, subject: string, content: string): void;
}

export class EmailNotificationService implements NotificationService {
  sendNotification(destination: string, subject: string, content: string): void {
    console.log(`Enviando EMAIL para ${destination}`);
    console.log(`Assunto: ${subject}`);
    console.log(`Conteúdo: ${content}`);
  }
}

export class SmsNotificationService implements NotificationService {
  sendNotification(destination: string, subject: string, content: string): void {
    console.log(`Enviando SMS para ${destination}`);
    console.log(`Mensagem: ${subject} - ${content}`);
  }
}

export class PushNotificationService implements NotificationService {
  sendNotification(destination: string, subject: string, content: string): void {
    console.log(`Enviando PUSH para ${destination}`);
    console.log(`Título: ${subject}`);
    console.log(`Mensagem: ${content}`);
  }
}

export type NotificationType = "email" | "sms" | "push";

export class NotificationFactory {
  static createNotificationService(type: NotificationType): NotificationService {
    
    let notificarionService: NotificationService
    if (type === "email") {
      notificarionService = new EmailNotificationService();
    } else if (type === "sms") {
      notificarionService = new SmsNotificationService();
    } else if (type === "push") {
      notificarionService = new PushNotificationService();
    } else {
      throw new Error("Tipo de notificação não suportado.");
    }

    return notificarionService;
  }
}