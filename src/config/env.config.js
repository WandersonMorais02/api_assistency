import "dotenv/config";

export const env = {
  port: process.env.PORT || 3333,
  nodeEnv: process.env.NODE_ENV || "development",

  mongoUri: process.env.MONGO_URI,

  corsOrigin: process.env.CORS_ORIGIN || "*",

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  appUrl: process.env.APP_URL || "http://localhost:3333",
};
