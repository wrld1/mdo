export const jwtConstants = {
  accessSecret: `${process.env.JWT_SECRET}`,
  refreshSecret: `${process.env.JWT_REFRESH_TOKEN_SECRET}`,
};
