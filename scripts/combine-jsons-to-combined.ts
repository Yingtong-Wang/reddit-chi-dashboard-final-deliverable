import { readFileSync, writeFileSync } from "fs";
import path from "path";

// Paths to your local JSONs
const dataDir = path.join(__dirname, "../data");
const qualitativePath = path.join(dataDir, "qualitative.json");
const quantitativePath = path.join(dataDir, "quantitative.json");

// Read and parse both JSONs
const qualitativeData = JSON.parse(readFileSync(qualitativePath, "utf-8"));
const quantitativeData = JSON.parse(readFileSync(quantitativePath, "utf-8"));

// Create lookup maps by normalized subreddit name
function normalizeSubredditName(name: string): string {
  return name.toLowerCase().trim().replace(/^r\//, "");
}

const qualitativeMap = new Map();
qualitativeData.forEach((item: any) => {
  const normalized = normalizeSubredditName(item.subreddit || "");
  if (normalized) qualitativeMap.set(normalized, item);
});

const quantitativeMap = new Map();
quantitativeData.forEach((item: any) => {
  const normalized = normalizeSubredditName(item.Subreddit || item.subreddit || "");
  if (normalized) quantitativeMap.set(normalized, item);
});

// Merge data by subreddit (outer join)
const allSubreddits = new Set([...qualitativeMap.keys(), ...quantitativeMap.keys()]);
const combined = Array.from(allSubreddits).map((subreddit) => {
  const qual = qualitativeMap.get(subreddit) || {};
  const quant = quantitativeMap.get(subreddit) || {};
  const CHS_qual = Number(qual.CHS_qual) || 0;
  const CHI_Score = Number(quant["CHI Score"] || quant.CHI_Score) || 0;
  const CHS_composite = Math.round(0.4 * CHS_qual + 0.6 * CHI_Score);
  return {
    subreddit: qual.subreddit || quant.Subreddit || quant.subreddit || subreddit,
    // Qualitative fields
    CHS_qual: qual.CHS_qual || null,
    Normalized_Sentiment: qual.Normalized_Sentiment || null,
    Normalized_Civility: qual.Normalized_Civility || null,
    Normalized_Empathy: qual.Normalized_Empathy || null,
    Normalized_Helpfulness: qual.Normalized_Helpfulness || null,
    Normalized_Relevance: qual.Normalized_Relevance || null,
    // Quantitative fields
    CHI_Score: quant["CHI Score"] || quant.CHI_Score || null,
    Subscribers: quant.Subscribers || null,
    Posts: quant.Posts || null,
    Members_Factor: quant["Members Factor"] || quant.Members_Factor || null,
    Content_Factor: quant["Content Factor"] || quant.Content_Factor || null,
    Traffic_Factor: quant["Traffic Factor"] || quant.Traffic_Factor || null,
    Responsiveness: quant.Responsiveness || null,
    Interaction: quant.Interaction || null,
    Health_Grade: quant["Health Grade"] || quant.Health_Grade || null,
    // Composite score
    CHS_composite,
  };
});

// Write to data/combined.json
const outputPath = path.join(dataDir, "combined.json");
writeFileSync(outputPath, JSON.stringify(combined, null, 2));
console.log(`✅ Combined data written to ${outputPath}`); 