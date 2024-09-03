export const jwtConstants = {
  accessSecret: `${process.env.JWT_SECRET}`,
  refreshSecret: `${process.env.JWT_REFRESH_TOKEN_SECRET}`,
  refreshExpiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`,
  resetPasswordSecret: `${process.env.JWT_RESET_PASSWORD_TOKEN_SECRET}`,
  resetPasswordExpiresIn: `${process.env.JWT_RESET_PASSWORD_TOKEN_EXPIRATION_TIME}`,
};
