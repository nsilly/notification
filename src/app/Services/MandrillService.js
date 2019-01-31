import mandrill from 'mandrill-api/mandrill';
import { BadRequestHttpException } from '@nsilly/exceptions';

export default class MandrillService {
  constructor() {
    this.mandrill_client = new mandrill.Mandrill(process.env.API_KEY_MANDRILL);
  }

  async listTemplate() {
    return new Promise((resolve, reject) => {
      const label = null;
      this.mandrill_client.templates.list(
        { label: label },
        function(result) {
          resolve(result);
        },
        function(e) {
          reject(new BadRequestHttpException('A mandrill error occurred: ' + e.name + ' - ' + e.message, 1));
        }
      );
    });
  }

  async getTemplate(nameTemplate) {
    return new Promise((resolve, reject) => {
      this.mandrill_client.templates.info(
        { name: nameTemplate },
        function(result) {
          resolve(result);
        },
        function(e) {
          reject(new BadRequestHttpException('A mandrill error occurred: ' + e.name + ' - ' + e.message, 1));
        }
      );
    });
  }
}
