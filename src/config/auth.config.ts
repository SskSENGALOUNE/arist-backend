import { registerAs } from "@nestjs/config";

export type AuthConfig = ReturnType<typeof authConfig>;

export const authConfig = registerAs("auth", () => ({
  accessTokenSecret: process.env.JWT_ACCESS_SECRET as string,
  accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "1d",
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET as string,
  refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "10", 10),
}));
