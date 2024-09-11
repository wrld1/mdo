export const Mail = {
  verification: 'verification',
  resetPassword: 'resetPassword',
} as const;

export type MailType = (typeof Mail)[keyof typeof Mail];
