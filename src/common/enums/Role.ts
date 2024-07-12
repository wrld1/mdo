export const Role = {
  User: 'user',
  Manager: 'manager',
  SuperAdmin: 'superAdmin',
} as const;

export type RoleEnum = (typeof Role)[keyof typeof Role];
