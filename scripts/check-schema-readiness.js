/** @format */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load env
const envPath = path.resolve(process.cwd(), ".env.local");
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Checking schema readiness...");
  // Try to select columns that were added in the new schema
  // arabic_translation, image_url, topic_tags
  const { data, error } = await supabase
    .from("words")
    .select("id, arabic_translation, image_url, topic_tags")
    .limit(1);

  if (error) {
    console.error("Schema check FAILED:", error.message);
    if (error.code === "PGRST301" || error.message.includes("does not exist")) {
      console.error("Reason: Table or Column likely missing.");
    }
    process.exit(1);
  } else {
    console.log("Schema check PASSED. New columns detected.");
    process.exit(0);
  }
}

check();
