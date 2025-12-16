/** @format */

// Load environment variables
require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

// CONFIGURATION
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verify credentials
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function resetProgress() {
  console.log("🚀 Starting Progress Reset...");

  // Since we might be in anonymous mode or just want to wipe EVERYTHING for dev:
  // We'll delete all rows from user_progress.

  const { error } = await supabase
    .from("user_progress")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // Hack to delete all rows (id != some impossible uuid)

  if (error) {
    console.error("❌ Error deleting progress:", error.message);
  } else {
    console.log("✅ Successfully cleared 'user_progress' table.");
    console.log("   The next session will start fresh from Book 1, Unit 1.");
  }
}

resetProgress();
