# Nsilly Notification

- [Nsilly Notification](#nsilly-notification)
  - [Installation](#installation)
    - [Import provider](#import-provider)
    - [Update User model](#update-user-model)
  - [How to use](#how-to-use)
    - [Register Notification](#register-notification)
    - [Call Notification](#call-notification)


## Installation

Install package from NPM


```
npm install @nsilly/notification
```

or

```
yarn add @nsilly/notification
```


### Import provider

Import module in `config/app.js`

```javascript
import { NotificationServiceProvider } from '@nsilly/notification';

export default {
  providers: [ 
    // ... Other Providers
    NotificationServiceProvider
  ]
};
```

### Update User model

Notifications may be sent in two ways: 
- Using the notify method of the Notifiable instance
- Using the Notification facade. 
  
First, let's explore using the Notifiable instance:

To do this we have to add extra function to `app/Models/User.js`

```javascript

import { SNS } from '@nsilly/notification';

export default (sequelize, DataTypes) => {
  // ... Model defination
  // Register Model property

  User.prototype.notify = function(notification) {
    return new Promise((resolve) => {
      const _this = this;
      const methods = notification.via();
      if (Array.isArray(methods) && methods.includes(SNS)) {
        _this.getDevices().then(devices => {
          _this.devices = devices;
          notification.setNotifiable(_this);
          notification.execute();
          resolve(true);
        });
      } else {
        notification.setNotifiable(_this);
        notification.execute();
        resolve(true);
      }
      
    })
  };

  return User;
};
```

## How to use

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