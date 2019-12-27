export default class NotificationManager {
  constructor() {
    this.channels = [];
  }

  register(channel) {
    this.channels.push(channel);
  }

  getChannels() {
    return this.channels;
  }
}
