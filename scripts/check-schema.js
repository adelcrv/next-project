/** @format */

require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing Supabase credentials.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkSchema() {
  console.log("🔍 Verifying 'words' table schema...");

  const dummyWord = {
    word: "schema_check_temp_" + Date.now(),
    definition: "Temporary check",
    extra_meanings: [{ meaning: "Test Meaning", example: "Test Example" }],
    // Include other required columns if any (usually word is the main unique one)
    book_number: 999,
    unit_number: 999,
  };

  try {
    // 1. Attempt Insertion
    const { data, error } = await supabase
      .from("words")
      .insert([dummyWord])
      .select();

    if (error) {
      console.error("❌ Schema Check FAILED.");
      console.error("Error details:", error.message);

      if (
        error.message.includes(
          'column "extra_meanings" of relation "words" does not exist'
        )
      ) {
        console.log("\n⚠️  DIAGNOSIS: The 'extra_meanings' column is missing.");
        console.log(
          "👉 Please run the migration: supabase/migrations/03_add_extra_meanings.sql"
        );
      }
      return;
    }

    const insertedID = data[0].id;
    console.log("✅ Insert successful! 'extra_meanings' column exists.");

    // 2. Cleanup
    const { error: deleteError } = await supabase
      .from("words")
      .delete()
      .eq("id", insertedID);

    if (deleteError) {
      console.warn(
        "⚠️ Validated schema but failed to clean up dummy row:",
        deleteError.message
      );
    } else {
      console.log("✅ Cleanup complete.");
    }

    console.log("\n🎉 SCHEMA IS COMPATIBLE. You can run the ingestion script.");
  } catch (err) {
    console.error("❌ Unexpected error:", err.message);
  }
}

checkSchema();
