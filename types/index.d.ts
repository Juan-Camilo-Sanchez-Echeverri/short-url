declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT: string | undefined;
    DB_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRATION: string;
  }
}
