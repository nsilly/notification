import * as _ from 'lodash';
import { SnsService } from '../Services/Facades/SnsService';

export const MAIL = 'mail';
export const SMS = 'sms';
export const SNS = 'sns';
export const MANRILL = 'manrill';

export class Notification {
  setNotifiable(notifiable) {
    this.notifiable = notifiable;
  }

  async executeEmailTask() {
    if (process.env.QUEUE_DRIVER === 'sync') {
      await this.toMail(this.notifiable).send();
    } else {
      this.toMail(this.notifiable).send();
    }
  }

  async executeManrillTask() {
    this.toMandrill(this.notifiable).sendTemplate();
  }

  async executeSnsTask() {
    let message = this.toSns();
    message = this.messageTransform(message);

    const devices = this.notifiable.devices;

    for (const device of devices) {
      SnsService.publish({ TargetArn: device.arn, Message: message, MessageStructure: 'json' });
    }
  }

  messageTransform(message) {
    const data = {
      default: JSON.stringify({
        data: {
          message: {
            title: message.title,
            body: message.body
          },
          meta: message.meta
        }
      }),
      APNS_SANDBOX: JSON.stringify({
        aps: {
          alert: {
            title: message.title,
            body: message.body
          },
          sound: 'default',
          badge: 1
        },
        meta: message.meta
      }),
      APNS: JSON.stringify({
        aps: {
          alert: {
            title: message.title,
            body: message.body
          },
          sound: 'default',
          badge: 1
        },
        meta: message.meta
      }),
      GCM: JSON.stringify({
        data: {
          meta: message.meta
        },
        notification: {
          title: message.title,
          body: message.body
        },
        priority: 'high',
        sound: 'default',
        badge: 1
      })
    };

    return JSON.stringify(data);
  }

  execute() {
    const methods = this.via();
    _.forEach(methods, method => {
      switch (method) {
        case MAIL:
          this.executeEmailTask();
          break;
        case SMS:
          break;
        case MANRILL:
          this.executeManrillTask();
          break;
        case SNS:
          this.executeSnsTask();
          break;
        default:
          break;
      }
    });
  }
}
