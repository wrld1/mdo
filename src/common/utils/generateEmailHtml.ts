import { MailType } from 'src/common/enums/MailType';
import { MailBody } from 'src/common/interfaces/mail-body';

export function generateEmailHtml(
  email: string,
  type: MailType,
  link?: string,
): MailBody {
  switch (type) {
    case 'verification':
      return {
        to: email,
        subject: 'Вітаємо на Osbb management system! Підтвердіть свій акаунт',
        template: '../../email/templates/confirmation',
        context: {
          email,
          link,
        },
      };

    case 'resetPassword':
      return {
        to: email,
        subject: 'Відновити пароль на Osbb management system',
        text: 'Відновлення паролю',
        html: `<b>Схоже, що ви забули свій пароль, от посилання на його відновлення: 
        <a href="${link}">Відновити пароль</a>
        </b>
        <p>Посилання перестане бути активним через 24 години.</p>`,
      };

    default:
      return {
        to: email,
        html: `
        <p>Схоже, це невірний лист. Сталася помилка</p>`,
      };
  }
}
