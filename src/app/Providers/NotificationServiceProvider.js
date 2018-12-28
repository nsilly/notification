import { App } from '@nsilly/container';
import { ServiceProvider } from '@nsilly/support';
import SnsService from '../Services/SnsServices';

export class NotificationServiceProvider extends ServiceProvider {
  register() {
    App.singleton('SnsService', SnsService);
  }
}
