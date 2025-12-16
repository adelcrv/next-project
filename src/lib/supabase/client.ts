/** @format */

import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./types";

// Provide fallback for build time - these will be replaced at runtime
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);
