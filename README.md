- [Nsilly Notification](#nsilly-notification)
  - [Install](#install)
  - [How to use](#how-to-use)
    - [Import provider](#import-provider)
    - [Update models/user](#update-modelsuser)
    - [Register Notification](#register-notification)
    - [Call Notification](#call-notification)

# Nsilly Notification

## Install

Download package form npm

```
yarn add @nsilly/notification
```

or

```
npm install @nsilly/notification
```

## How to use

### Import provider
Import module at config/app.js

```javascript
import { NotificationServiceProvider } from '@nsilly/notification';

export default {
  providers: [AppServiceProvider, NotificationServiceProvider]
};
```

### Update models/user

To use notification you must register devices for user. To do this we add setter, notify method to models/user.js file

```javascript
export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING
    },
    {
      underscored: true
    }
  );

  User.prototype.setter = function setter(key, value) {
    this[key] = value;
  };

  User.prototype.notify = function notify(notification) {
    const _this = this;
    notification.setNotifiable(_this);
    notification.execute();
  };

  return User;
};
```

### Register Notification
```javascript
import { Notification, SNS } from '@nsilly/notification';

export class SendNotificationToAdminWhenOwnerAcceptedCancel extends Notification {
  constructor(booking, owner_booking, driver) {
    super();
    this.booking = booking;
    this.owner_booking = owner_booking;
    this.driver = driver;
  }

  via() {
    return [SNS];
  }

  toSns() {
    const message = {
      title: 'Chủ xe chấp nhận hủy chuyến xe',
      body: `Chủ xe ${this.owner_booking.area_code} ${this.owner_booking.phone_number} chấp nhận cho lái xe ${this.driver.area_code} ${this.driver.phone_number} hủy chuyến xe ${
        this.booking.id
      }`,
      meta: {
        booking_id: this.booking.id,
        owner_booking_id: this.owner_booking.id,
        driver_id: this.driver.id,
        type: new SendNotificationToAdminWhenOwnerAcceptedCancel().constructor.name
      }
    };

    return message;
  }
}
```

### Call Notification

```javascript
const user = await App.make(UserRepository).findById(1);
const devices = await App.make(DeviceRepository).where('user_id', user.id).get();
user.setter('devices', devices);

const notify = new SendNotificationToAdminWhenOwnerAcceptedCancel(booking, owner_booking, driver);
user.notify(notify);
```