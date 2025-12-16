/** @format */

require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkCounts() {
  console.log("--- Database Word Counts (Exact) ---");
  let total = 0;

  for (let i = 1; i <= 6; i++) {
    const { count, error } = await supabase
      .from("words")
      .select("*", { count: "exact", head: true })
      .eq("book_number", i);

    if (error) {
      console.error(`Book ${i}: Error`, error.message);
    } else {
      console.log(`Book ${i}: ${count} / 600 ${count === 600 ? "✅" : "❌"}`);
      total += count;
    }
  }
  console.log(`Total: ${total} / 3600`);
}

checkCounts();
