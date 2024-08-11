export const jwtConstants = {
  accessSecret: `${process.env.JWT_SECRET}`,
  refreshSecret: `${process.env.JWT_REFRESH_TOKEN_SECRET}`,
  refreshExpiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`,
};
