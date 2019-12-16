import nodemailer from 'nodemailer';
import Style from './Style';
import * as _ from 'lodash';
import { Exception } from '@nsilly/exceptions';
import { MailableConstract } from './MailableConstract';

export default class Mailable extends MailableConstract {
  constructor() {
    super();
    this.content = '';
    this._greeting = undefined;
    this.customGreetingStyle = null;
    this.customSubjectStyle = null;
    this.from = process.env.DEFAULT_SENDER_EMAIL;
    this.from_name = process.env.DEFAULT_SENDER;
  }

  to(to, name = '') {
    if (_.isNil(to)) {
      throw new Exception("receiver's email is required");
    }
    this.to = to;
    this.to_name = name;
    return this;
  }

  from(from, name = '') {
    if (_.isNil(from)) {
      throw new Exception("sender's email is required");
    }
    this.from = from;
    this.from_name = name;
    return this;
  }

  subject(subject = '', customStyle = null) {
    this.customSubjectStyle = customStyle;
    this.subject = subject;
    return this;
  }

  greeting(msg = '', customStyle = null) {
    this.customGreetingStyle = customStyle;
    this._greeting = msg;
    return this;
  }

  line(text = '', customStyle = null) {
    this.content += _.isNil(customStyle) ? `<p style="${Style.paragraph}">${text}</p>` : `<p style="${Style.paragraph} ${customStyle}">${text}</p>`;
    return this;
  }

  section(data = '', customStyle = null) {
    this.content += _.isNil(customStyle) ? `<div>${data}</div>` : `<div style="${customStyle}">${data}</div>`;
    return this;
  }

  action(text = '', link = '#', type = 'default') {
    this.content += `<div style="text-align:center">
            <a href="${link}">
                <button style="${Style.button} ${Style.button_default}" class="${type}">${text}</button>
            </a>    
        </div>`;
    return this;
  }

  buildContent() {
    let html = `<html><body style="${Style.body}">`;
    html += `<div style="${Style.box}">`;
    html += _.isNil(this.customSubjectStyle) ? `<h1 style="${Style.subject}">${this.subject}</h1>` : `<h1 style="${Style.subject} ${this.customSubjectStyle}">${this.subject}</h1>`;
    if (this._greeting !== undefined && this._greeting !== '') {
      html += _.isNil(this.customGreetingStyle)
        ? `<div style="${Style.greeting}">${this._greeting}</div>`
        : `<div style="${Style.greeting} ${this.customGreetingStyle}">${this._greeting}</div>`;
    }
    html += `<div style="${Style.content}">${this.content}</div>`;
    html += '</div></body></html>';
    return html;
  }

  send() {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: Number(process.env.MAIL_PORT) === 465,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      }
    });

    return new Promise((resolve, reject) => {
      transporter.sendMail(
        {
          from: this.from,
          to: this.to,
          subject: this.subject,
          html: this.buildContent()
        },
        function(err, info) {
          if (!err) {
            resolve({ sent: true, payload: info });
          } else {
            reject(err);
          }
        }
      );
    });
  }
}
