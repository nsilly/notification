import Style from './Style';
import _ from 'lodash';
import { Exception } from '@nsilly/exceptions';
const nodemailer = require('nodemailer');

export default class Email {
  constructor() {
    this.from = process.env.EMAIL_FROM;
    this.from_name = process.env.EMAIL_FROM_NAME;
    this.content = '';
    this.customGreetingStyle = null;
    this.customSubjectStyle = null;
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

  greeting(greeting = '', customStyle = null) {
    this.customGreetingStyle = customStyle;
    this.greeting = greeting;
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

  action(text = '', link = '#') {
    this.content += `<div style="text-align:center">
            <a href="${link}">
                <button style="${Style.button} ${Style.button_default}">${text}</button>
            </a>    
        </div>`;
    return this;
  }

  buildContent() {
    let html = `<html><body style="${Style.body}">`;
    html += _.isNil(this.customSubjectStyle) ? `<h1 style="${Style.subject}">${this.subject}</h1>` : `<h1 style="${Style.subject} ${this.customSubjectStyle}">${this.subject}</h1>`;
    html += _.isNil(this.customGreetingStyle)
      ? `<div style="${Style.greeting}">${this.greeting}</div>`
      : `<div style="${Style.greeting} ${this.customGreetingStyle}">${this.greeting}</div>`;
    html += `<div style="${Style.content}">${this.content}</div>`;
    html += '</body></html>';
    return html;
  }

  send() {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'ssl',
      auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD // generated ethereal password
      }
    });

    return transporter.sendMail({
      from: this.from,
      to: this.to,
      subject: this.subject,
      html: this.buildContent()
    });
  }
}
