import AWS from 'aws-sdk';
import { Exception } from '@nsilly/exceptions';

const { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, AWS_SNS_IOS_ARN_ENDPOINT, AWS_SNS_ANDROID_ARN_ENDPOINT } = process.env;

export default class SnsService {
  constructor() {
    this.sns = new AWS.SNS({
      credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY
      },
      region: AWS_REGION,
      apiVersion: '2010-03-31'
    });
  }

  createEndPoint(os, token) {
    const arnEndPoint = os === 'android' ? AWS_SNS_ANDROID_ARN_ENDPOINT : AWS_SNS_IOS_ARN_ENDPOINT;
    return new Promise((resolve, reject) => {
      this.sns.createPlatformEndpoint(
        {
          PlatformApplicationArn: arnEndPoint,
          Token: token
        },
        (err, data) => {
          if (err) {
            reject(new Exception('Device token is not valid', 5010));
          }

          resolve(data);
        }
      );
    });
  }

  getClient() {
    return this.sns;
  }

  publish(params) {
    return new Promise((resolve, reject) => {
      this.sns.publish(params, (err, data) => {
        if (err) {
          reject(new Exception('Device token is not valid', 5010));
        }

        resolve(data);
      });
    });
  }
}
