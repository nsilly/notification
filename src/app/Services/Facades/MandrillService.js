import { App } from '@nsilly/container';

export class MandrillService {
  static async listTemplate() {
    const result = await App.make('NotificationMandrillService').listTemplate();
    return result;
  }

  static async getTemplate(nameTemplate) {
    const result = await App.make('NotificationMandrillService').getTemplate(nameTemplate);
    return result;
  }
}
