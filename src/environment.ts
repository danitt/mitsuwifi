import { config } from "https://deno.land/x/dotenv/mod.ts";

export const APP_VERSION = '3.0.513';

// Import & validate env vars
export const {
  MITSU_USERNAME,
  MITSU_PASSWORD,
} = config({ safe: true });
