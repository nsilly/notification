import mandrill from 'mandrill-api/mandrill';
import * as _ from 'lodash';
import { Exception } from '@nsilly/exceptions';

export default class Mandrill {
  constructor() {
    this.mandrill_client = new mandrill.Mandrill(process.env.API_KEY_MANDRILL);
    this.from;
    this.from_name;
    this.to;
    this.to_name;
    this.subject;
    this.content;
    this.tags = [];
    this.headers = [];
    this.merge_fields = [];
    this.rcpt_email;
    this.rcpt_id;
  }

  listTemplate(label = null) {
    return this.mandrill_client.templates.list(label);
  }

  getTemplate(name) {
    return this.mandrill_client.templates.info(name);
  }

  from(from, from_name = '') {
    this.from = from;
    this.from_name = from_name;
    return this;
  }

  to(to, to_name) {
    this.to = to;
    this.to_name = to_name;
    return this;
  }

  content(content) {
    this.content = content;
    return this;
  }

  subject(subject) {
    this.subject = process.env.PREFIX_SUBJECT + ' ' + subject;
    return this;
  }

  addTag(tag) {
    this.tags = tag;
    return this;
  }

  addRecipientMetadata(rcpt_email, rcpt_id) {
    this.rcpt_email = rcpt_email;
    this.rcpt_id = rcpt_id;
    return this;
  }

  headers(headers = {}) {
    if (!_.isObject(headers)) {
      throw new Exception('headers must be an object', 1);
    }
    this.headers = headers;
    return this;
  }

  mergeFields(merge_fields = []) {
    if (!_.isObject(merge_fields)) {
      throw new Exception('merge_fields must be an array', 1);
    }
    this.merge_fields = merge_fields;
    return this;
  }

  template(name, content = []) {
    this.template_name = name;
    this.template_content = content;
    return this;
  }

  send() {
    const message = {
      html: this.content,
      text: this.content,
      subject: this.subject,
      from_email: this.from,
      from_name: this.from_name,
      to: [
        {
          email: this.to,
          name: this.to_name,
          type: 'to'
        }
      ],
      headers: this.headers,
      important: false,
      track_opens: null,
      track_clicks: null,
      auto_text: null,
      auto_html: null,
      inline_css: null,
      url_strip_qs: null,
      preserve_recipients: null,
      view_content_link: null,
      tracking_domain: null,
      signing_domain: null,
      return_path_domain: null,
      merge: true,
      merge_language: 'mailchimp',
      tags: this.tags
    };
    const async = false;
    this.mandrill_client.messages.send(
      { message: message, async: async },
      function(result) {
        return result;
      },
      function(e) {
        throw new Exception('A mandrill error occurred: ' + e.name + ' - ' + e.message, 1);
      }
    );
  }

  sendTemplate() {
    const message = {
      html: this.content,
      text: this.content,
      subject: this.subject,
      from_email: this.from,
      from_name: this.from_name,
      to: [
        {
          email: this.to,
          name: this.to_name,
          type: 'to'
        }
      ],
      headers: this.headers,
      important: false,
      track_opens: null,
      track_clicks: null,
      auto_text: null,
      auto_html: null,
      inline_css: null,
      url_strip_qs: null,
      preserve_recipients: null,
      view_content_link: null,
      tracking_domain: null,
      signing_domain: null,
      return_path_domain: null,
      merge: true,
      merge_language: 'mailchimp',
      merge_vars: [
        {
          rcpt: this.to,
          vars: this.merge_fields
        }
      ],
      tags: this.tags,
      metadata: {
        website: 'www.reflaunt-test.com'
      },
      recipient_metadata: [
        {
          rcpt: this.rcpt_email,
          values: {
            user_id: this.rcpt_id
          }
        }
      ]
    };
    const async = false;
    this.mandrill_client.messages.sendTemplate(
      { template_name: this.template_name, template_content: this.template_content, message: message, async: async },
      function(result) {
        return result;
      },
      function(e) {
        throw new Exception('A mandrill error occurred: ' + e.name + ' - ' + e.message, 1);
      }
    );
  }
}
