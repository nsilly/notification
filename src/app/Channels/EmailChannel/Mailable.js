import nodemailer from 'nodemailer';
import Style from './Style';
import * as _ from 'lodash';
import { Exception } from '@nsilly/exceptions';
import { MailableConstract } from './MailableConstract';

export default class Mailable extends MailableConstract {
  constructor() {
    super();
    this.content = '';
    this._to = undefined;
    this._greeting = undefined;
    this.customGreetingStyle = null;
    this.customSubjectStyle = null;
    this._attachments = [];
    this._ccs = [];
    this._bccs = [];

    if (!_.isNil(process.env.DEFAULT_SENDER_EMAIL) && process.env.DEFAULT_SENDER_EMAIL !== '') {
      if (!_.isNil(process.env.DEFAULT_SENDER) && process.env.DEFAULT_SENDER !== '') {
        this._from = `"${process.env.DEFAULT_SENDER}" ${process.env.DEFAULT_SENDER_EMAIL}`;
      } else {
        this._from = process.env.DEFAULT_SENDER_EMAIL;
      }
    }
  }

  /**
   * Comma separated list or an array of recipients email addresses that will appear on the To: field
   *
   * @param {*} to String | Array
   *
   * @return self
   */
  to(to) {
    if (_.isNil(to)) {
      throw new Exception("receiver's email is required");
    }
    this._to = to;
    return this;
  }

  /**
   * recipient email addresses that will appear on the Cc: field
   *
   * @param {*} cc String
   *
   * @return self
   */

  cc(cc) {
    this._ccs.push(cc);
    return this;
  }

  /**
   * recipient email addresses that will appear on the bcc: field
   *
   * @param {*} bcc String
   *
   * @return self
   */

  bcc(bcc) {
    this._bccs.push(bcc);
    return this;
  }

  /**
   * Attachment object
   *
   * @param {*} attachment Object
   *
   * @return self
   */

  attach(attachment) {
    this._attachments.push(attachment);
    return this;
  }

  /**
   * The email address of the sender.‘
   *
   * @param {*} from String | Array
   * @param {*} name String | Array
   *
   * @return self
   */
  from(from, name) {
    if (_.isNil(from)) {
      throw new Exception("sender's email is required");
    }
    if (_.isNil(name) || name === '') {
      this._from = from;
    } else {
      this._from = `"${name}" ${from}`;
    }
    return this;
  }

  /**
   * The subject of the email
   *
   * @param {*} subject String
   * @param {*} customStyle Object
   *
   * @return self
   */
  subject(subject = '', customStyle = null) {
    this.customSubjectStyle = customStyle;
    this.subject = subject;
    return this;
  }

  /**
   * Add a greeting line to email content
   *
   * @param {*} msg String
   * @param {*} customStyle Object
   *
   * @return self
   */
  greeting(msg = '', customStyle = null) {
    this.customGreetingStyle = customStyle;
    this._greeting = msg;
    return this;
  }

  /**
   * Add a line to email content
   *
   * @param {*} text String
   * @param {*} customStyle Object
   *
   * @return self
   */

  line(text = '', customStyle = null) {
    this.content += _.isNil(customStyle) ? `<p style="${Style.paragraph}">${text}</p>` : `<p style="${Style.paragraph} ${customStyle}">${text}</p>`;
    return this;
  }

  /**
   * Add a section to email content
   *
   * @param {*} data String
   * @param {*} customStyle Object
   *
   * @return self
   */

  section(data = '', customStyle = null) {
    this.content += _.isNil(customStyle) ? `<div>${data}</div>` : `<div style="${customStyle}">${data}</div>`;
    return this;
  }

  /**
   * Add a CTA to email content
   *
   * @param {*} text String
   * @param {*} link String
   *
   * @return self
   */

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
    const params = {
      from: this._from,
      to: this._to,
      subject: this.subject,
      html: this.buildContent()
    };
    if (_.isArray(this._ccs) && this._ccs.length > 0) {
      params.cc = this._ccs;
    }
    if (_.isArray(this._bccs) && this._bccs.length > 0) {
      params.bcc = this._bccs;
    }
    if (_.isArray(this._attachments) && this._attachments.length > 0) {
      params.attachments = this._attachments;
    }
    return new Promise((resolve, reject) => {
      transporter.sendMail(params, function(err, info) {
        if (!err) {
          resolve({ sent: true, payload: info });
        } else {
          reject(err);
        }
      });
    });
  }
}
