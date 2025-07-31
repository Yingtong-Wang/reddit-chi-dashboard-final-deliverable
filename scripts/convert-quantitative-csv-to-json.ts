import { readFileSync, writeFileSync } from "fs";
import path from "path";

// Helper to parse CSV
function parseCSV(csvText: string) {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim());
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.replace(/"/g, "").trim());
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });
    data.push(row);
  }
  return data;
}

// Path to your local CSV
const dataDir = path.join(__dirname, "../data");
const quantitativePath = path.join(dataDir, "quantitative.csv");

// Read and parse CSV
const quantitativeCSV = readFileSync(quantitativePath, "utf-8");
const quantitativeData = parseCSV(quantitativeCSV);

// Write to data/quantitative.json
const outputPath = path.join(dataDir, "quantitative.json");
writeFileSync(outputPath, JSON.stringify(quantitativeData, null, 2));
console.log(`✅ Quantitative data written to ${outputPath}`); 