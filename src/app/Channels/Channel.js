import { Exception } from '@nsilly/exceptions';

export class Channel {
  constructor() {
    this.name = undefined;
  }

  getName() {
    return this.name;
  }

  execute(notifiable) {
    throw new Exception('Method should be implemented');
  }
}
