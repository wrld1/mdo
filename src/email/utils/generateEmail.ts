import { MailType } from 'src/common/enums/MailType';
import { MailBody } from 'src/common/interfaces/mail-body';

export function generateEmail(
  email: string,
  type: MailType,
  link?: string,
): MailBody {
  switch (type) {
    case 'verification':
      return {
        to: email,
        subject: 'Вітаємо на Osbb management system! Підтвердіть свій акаунт',
        template: '../templates/confirmation.hbs',
        context: {
          email,
          link,
        },
      };

    case 'resetPassword':
      return {
        to: email,
        subject: 'Відновити пароль на Osbb management system',
        template: '../templates/resetPassword',
        context: {
          email,
          link,
        },
      };

    default:
      return {
        to: email,
        html: `
        <p>Схоже, це невірний лист. Сталася помилка</p>`,
      };
  }
}
