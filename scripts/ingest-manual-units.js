/** @format */

// Load environment variables
require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// CONFIGURATION
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const DATA_DIR = path.join(process.cwd(), "english-voc", "data", "units");

// Verify credentials
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Extracts book and unit numbers from filename
 * Format expected: "book1 unit5.json" or similar
 */
function parseFilename(filename) {
  const name = filename.toLowerCase();

  // Extract 'book' followed by digits
  const bookMatch = name.match(/book\s*(\d+)/);
  const unitMatch = name.match(/unit\s*(\d+)/);

  return {
    book: bookMatch ? parseInt(bookMatch[1]) : 0,
    unit: unitMatch ? parseInt(unitMatch[1]) : 0,
  };
}

async function ingestFile(filePath) {
  const fileName = path.basename(filePath);

  if (!fileName.endsWith(".json")) return;

  const { book, unit: fileUnit } = parseFilename(fileName);

  if (book === 0) {
    console.warn(`⚠️ Could not parse book number from: ${fileName}`);
    return;
  }

  try {
    const rawData = fs.readFileSync(filePath, "utf8");
    const words = JSON.parse(rawData);

    // Transform data
    const enrichedWords = words
      .map((w) => ({
        word: w.word ? w.word.toLowerCase().trim() : "",

        // Standard Fields
        definition: w.definition,
        example_sentence: w.example || w.example_sentence,
        part_of_speech: w.part_of_speech,
        phonetic: w.phonetic,

        // Arabic Fields
        arabic_translation: w.arabic_translation,
        arabic_definition: w.arabic_definition,
        arabic_example: w.arabic_example,

        // Metadata
        book_number: book,
        unit_number: w.unit || fileUnit, // Prefer JSON unit, fallback to filename

        // New Complex Field
        extra_meanings: w.extra_meanings || [],
      }))
      .filter((w) => w.word !== ""); // Basic validation

    if (enrichedWords.length === 0) {
      console.log(`ℹ️ Empty file: ${fileName}`);
      return;
    }

    // Batch Insert (50 at a time)
    const BATCH_SIZE = 50;
    for (let i = 0; i < enrichedWords.length; i += BATCH_SIZE) {
      const batch = enrichedWords.slice(i, i + BATCH_SIZE);

      const { error } = await supabase
        .from("words")
        .upsert(batch, { onConflict: "word" });

      if (error) {
        console.error(`❌ Error in ${fileName} (Batch ${i}):`, error.message);
      }
    }

    console.log(
      `✅ Processed ${fileName}: ${enrichedWords.length} words inserted.`
    );
  } catch (error) {
    console.error(`❌ Failed to process ${fileName}:`, error.message);
  }
}

async function runIngestion() {
  console.log("🚀 Starting Bulk Ingestion...");
  console.log(`📂 Scanning directory: ${DATA_DIR}`);

  if (!fs.existsSync(DATA_DIR)) {
    console.error(`❌ Directory not found: ${DATA_DIR}`);
    return;
  }

  const files = fs.readdirSync(DATA_DIR);
  // Sort naturally to process book1 before book2 etc.
  files.sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
  );

  console.log(`Found ${files.length} files.`);

  // Process serially to avoid overwhelming DB connection pool
  for (const file of files) {
    const fullPath = path.join(DATA_DIR, file);
    await ingestFile(fullPath);
    // Tiny delay
    await new Promise((r) => setTimeout(r, 50));
  }

  console.log("🎉 All files processed!");
}

runIngestion();
