import { App } from '@nsilly/container';
import { ServiceProvider } from '@nsilly/support';
import SnsService from '../Services/SnsServices';
import MandrillService from '../Services/MandrillService';
import { ServiceNameBuilder } from '../Utils/ServiceNameBuilder';
import NotificationManager from './NotificationManager';

export default class NotificationServiceProvider extends ServiceProvider {
  register() {
    App.singleton(new ServiceNameBuilder().get('NotificationManager'), NotificationManager);
    App.singleton('SnsService', SnsService);
    App.singleton('NotificationMandrillService', MandrillService);
  }
}
