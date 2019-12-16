import { ServiceNameBuilder } from '../Utils/ServiceNameBuilder';
import { App } from '@nsilly/container';
import { Exception } from '@nsilly/exceptions';
export default class NotificationService {
  static getInstance() {
    if (this.instance === undefined) {
      this.instance = App.make(new ServiceNameBuilder().get('NotificationManager'));
    }
    return this.instance;
  }

  static register(channels) {
    if (!Array.isArray(channels)) {
      throw new Exception(`channels should be an array`);
    }
    channels.forEach(channel => {
      const instance = this.getInstance();
      instance.register(channel);
    });
  }
}
