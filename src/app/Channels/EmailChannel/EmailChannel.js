import Channel from '../Channel';

export const MAIL = 'MAIL';

export default class EmailChannel extends Channel {
  constructor() {
    super();
    this.name = 'MAIL';
  }

  async execute(notification) {
    const result = await notification.toMail(notification.notifiable).send();
    return result;
  }
}
