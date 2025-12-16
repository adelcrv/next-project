/** @format */

const fs = require("fs");
const path = require("path");

const sourceDir = "pdf sources/extracted words as object by google ai studio";
const files = [
  "book1.txt",
  "book2.txt",
  "book3.txt",
  "book4.txt",
  "book5.txt",
  "book6.txt",
];

function checkDuplicates() {
  const wordMap = new Map();
  const duplicates = [];

  files.forEach((file, bookIndex) => {
    const filePath = path.join(process.cwd(), sourceDir, file);
    if (!fs.existsSync(filePath)) {
      console.log(`Missing file: ${file}`);
      return;
    }

    const content = fs.readFileSync(filePath, "utf8");
    const words = JSON.parse(content);

    words.forEach((w) => {
      const cleanWord = w.word.toLowerCase().trim();
      const bookNum = bookIndex + 1;

      if (wordMap.has(cleanWord)) {
        duplicates.push({
          word: cleanWord,
          firstSeen: wordMap.get(cleanWord),
          duplicateIn: `Book ${bookNum}`,
        });
      } else {
        wordMap.set(cleanWord, `Book ${bookNum}`);
      }
    });
  });

  console.log(`Total Unique Words found in source files: ${wordMap.size}`);
  console.log(`Total Duplicates found: ${duplicates.length}`);

  if (duplicates.length > 0) {
    console.log("\nDuplicate Details:");
    duplicates.forEach((d) => {
      console.log(
        `- "${d.word}": First in ${d.firstSeen}, also in ${d.duplicateIn}`
      );
    });
  }
}

checkDuplicates();
