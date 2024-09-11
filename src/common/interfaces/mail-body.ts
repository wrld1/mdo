export interface MailBody {
  to: string;
  from?: string;
  text?: string;
  subject?: string;
  html?: string;
  template?: any;
  context?: any;
}
