export interface ISmsProvider {
  sendSms(phoneNumber: string, message: string): Promise<any>;
  validatePhoneNumber(phoneNumber: string): boolean;
}
