import { App } from '@nsilly/container';
import { ServiceProvider } from '@nsilly/support';
import SnsService from '../Services/SnsServices';
import MandrillService from '../Services/MandrillService';

export class NotificationServiceProvider extends ServiceProvider {
  register() {
    App.singleton('SnsService', SnsService);
    App.singleton('NotificationMandrillService', MandrillService);
  }
}
