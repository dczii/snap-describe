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
  refreshToken: process.env.JWT_REFRESH_TOKEN_SECRET,
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseSRK: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  supabaseBucket: process.env.SUPABASE_BUCKET || "images"
};


