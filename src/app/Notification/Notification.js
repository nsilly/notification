import * as _ from 'lodash';
import { Exception } from '@nsilly/exceptions';
import { App } from '@nsilly/container';
import { ServiceNameBuilder } from '../Utils/ServiceNameBuilder';

export default class Notification {
  via() {
    throw new Exception('Method should be implemented');
  }

  setNotifiable(notifiable) {
    this.notifiable = notifiable;
  }

  async execute() {
    const manager = App.make(new ServiceNameBuilder().get('NotificationManager'));
    const availableChannels = manager.getChannels();
    const channels = this.via();
    const result = [];
    if (!_.isArray(channels)) {
      throw new Exception('channels should be an array');
    }
    if (
      _.intersection(
        channels,
        availableChannels.map(ch => ch.getName())
      ).length < channels.length
    ) {
      throw new Exception('No channel is registered');
    }

    for (const channel_name of channels) {
      const channel = _.find(availableChannels, ch => ch.getName() === channel_name);
      const data = await channel.execute(this);
      result.push({ channel: channel_name, payload: data });
    }
    return result;
  }
}
