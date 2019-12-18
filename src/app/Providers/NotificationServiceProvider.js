import { App } from '@nsilly/container';
import { ServiceProvider } from '@nsilly/support';
import { ServiceNameBuilder } from '../Utils/ServiceNameBuilder';
import NotificationManager from './NotificationManager';

export default class NotificationServiceProvider extends ServiceProvider {
  register() {
    App.singleton(new ServiceNameBuilder().get('NotificationManager'), NotificationManager);
  }
}
