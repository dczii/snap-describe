import dotenv from "dotenv" 

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
};

//env
export const env = {
  node: process.env.NODE_ENV || "development",
  isProd: process.env.NODE_ENV === "production",
  isDev: process.env.NODE_ENV === "development",
  isTest: process.env.NODE_ENV === "test",
  port: parseInt(process.env.PORT ?? "4000", 10),
  dbUrl: process.env.DATABASE_URL ?? "",
  accessToken: process.env.JWT_ACCESS_TOKEN_SECRET,
  refreshToken: process.env.JWT_REFRESH_TOKEN_SECRET
};

