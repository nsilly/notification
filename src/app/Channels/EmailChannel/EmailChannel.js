import Channel from '../Channel';
import _ from 'lodash';

export const MAIL = 'MAIL';

export default class EmailChannel extends Channel {
  /**
   * Create a email channel
   * @param {object} options - The configuration
   * @param {string} options.defaultCcAddress - The default address to CC in all email
   * @param {string} options.defaultBccAddress - The default address to BCC in all email
   */
  constructor(options) {
    super();
    this.options = options || {};
    this.name = 'MAIL';
  }

  async execute(notification) {
    let mailable = notification.toMail(notification.notifiable);
    if (_.isObject(this.options) && _.isString(this.options.defaultCcAddress)) {
      mailable = mailable.cc(this.options.defaultCcAddress);
    }
    if (_.isObject(this.options) && _.isString(this.options.defaultBccAddress)) {
      mailable = mailable.bcc(this.options.defaultBccAddress);
    }
    const result = await mailable.send();
    return result;
  }
}
