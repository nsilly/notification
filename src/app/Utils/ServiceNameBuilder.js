export const DEFAULT_SERVICE_NAME_PREFIX = 'NF_NOTIFICATION_PKG_';
export class ServiceNameBuilder {
  get(classname) {
    return `${DEFAULT_SERVICE_NAME_PREFIX}${classname}`;
  }
}
