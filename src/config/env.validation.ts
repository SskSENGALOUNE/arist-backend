import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'staging', 'production')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  SERVICE_NAME: Joi.string().default('payment-center'),
  LOG_LEVEL: Joi.string()
    .valid('debug', 'info', 'warn', 'error')
    .default('info'),

  DATABASE_URL: Joi.string().uri({ scheme: ['postgresql', 'postgres'] }).required(),

  CORS_ORIGINS: Joi.string().default('*'),

  THROTTLE_TTL_MS: Joi.number().default(60_000),
  THROTTLE_LIMIT: Joi.number().default(100),

  BODY_LIMIT: Joi.string().default('1mb'),

  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('1d'),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  BCRYPT_SALT_ROUNDS: Joi.number().min(4).max(15).default(10),

  KAFKA_BROKERS: Joi.string().optional(),
  KAFKA_CLIENT_ID: Joi.string().optional(),

  // ───── Supabase Storage (profile photos, banners, …) ─────
  SUPABASE_URL: Joi.string().uri().required(),
  SUPABASE_SERVICE_KEY: Joi.string().required(),
  SUPABASE_BUCKET: Joi.string().default('arist'),

  // ───── MinIO (deprecated — replaced by Supabase Storage) ─────
  MINIO_ENDPOINT: Joi.string().optional(),
  MINIO_PORT: Joi.number().port().default(9000),
  MINIO_USE_SSL: Joi.boolean().default(false),
  MINIO_ACCESS_KEY: Joi.string().optional(),
  MINIO_SECRET_KEY: Joi.string().optional(),
  MINIO_BUCKET: Joi.string().default('arist-uploads'),
}).unknown(true);
