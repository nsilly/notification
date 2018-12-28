import { App } from '@nsilly/container';

export class SnsService {
  static async registerDevice(os, token) {
    const snsService = App.make('SnsService');
    const result = await snsService.createEndPoint(os, token);

    return result;
  }

  static getClient() {
    const snsService = App.make('SnsService');
    const client = snsService.getClient();

    return client;
  }

  static publish(params) {
    const snsService = App.make('SnsService');
    snsService.publish(params);
  }
}
