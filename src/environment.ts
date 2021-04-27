import { config } from "https://deno.land/x/dotenv/mod.ts";

// Import & validate env vars
export const {
  MITSU_USERNAME,
  MITSU_PASSWORD,
} = config({ safe: true });
