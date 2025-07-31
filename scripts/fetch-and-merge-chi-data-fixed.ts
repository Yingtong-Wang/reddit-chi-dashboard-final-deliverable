// Script to fetch and merge CHI data from both CSV files with proper outer join
import { writeFileSync, mkdirSync, existsSync } from "fs"

async function fetchAndMergeCHIDataFixed() {
  console.log("Fetching CHI data from both CSV files with improved merging...")

  // Fetch qualitative metrics data
  const qualitativeResponse = await fetch(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/subreddit_aggregated_results_sampled_20250719_201325-Vvb37HUXtyRsQBS5lNOy9bTeR8Z91Z.csv",
  )
  const qualitativeCSV = await qualitativeResponse.text()

  // Fetch quantitative CHI comparison data
  const quantitativeResponse = await fetch(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reddit_chi_comparison_16july-placeholder.csv", // Replace with actual URL when available
  )

  // Extended simulated quantitative data to match all 16 subreddits
  const simulatedQuantitativeData = [
    { subreddit: "personalfinance", CHS_quan: 720, posts: 2156, comments: 45678, retention: 0.85, engagement: 0.78 },
    { subreddit: "farming", CHS_quan: 680, posts: 1247, comments: 18543, retention: 0.92, engagement: 0.87 },
    { subreddit: "iCheckMovies", CHS_quan: 420, posts: 892, comments: 3421, retention: 0.65, engagement: 0.42 },
    { subreddit: "AskReddit", CHS_quan: 580, posts: 8500, comments: 125000, retention: 0.72, engagement: 0.68 },
    { subreddit: "technology", CHS_quan: 650, posts: 3200, comments: 67800, retention: 0.79, engagement: 0.74 },
    { subreddit: "TwoXChromosomes", CHS_quan: 590, posts: 1800, comments: 32400, retention: 0.76, engagement: 0.71 },
    { subreddit: "Parenting", CHS_quan: 750, posts: 980, comments: 15600, retention: 0.88, engagement: 0.82 },
    { subreddit: "Seattle", CHS_quan: 480, posts: 1200, comments: 18900, retention: 0.69, engagement: 0.58 },
    { subreddit: "science", CHS_quan: 710, posts: 4500, comments: 89000, retention: 0.83, engagement: 0.79 },
    { subreddit: "relationships", CHS_quan: 620, posts: 2800, comments: 56700, retention: 0.77, engagement: 0.73 },
    { subreddit: "fitness", CHS_quan: 580, posts: 1900, comments: 28400, retention: 0.74, engagement: 0.69 },
    { subreddit: "cooking", CHS_quan: 640, posts: 1600, comments: 22100, retention: 0.81, engagement: 0.75 },
    { subreddit: "books", CHS_quan: 590, posts: 1400, comments: 19800, retention: 0.78, engagement: 0.71 },
    { subreddit: "photography", CHS_quan: 520, posts: 1100, comments: 14200, retention: 0.7, engagement: 0.62 },
    { subreddit: "gardening", CHS_quan: 670, posts: 890, comments: 12300, retention: 0.86, engagement: 0.8 },
    { subreddit: "DIY", CHS_quan: 610, posts: 1350, comments: 18900, retention: 0.75, engagement: 0.68 },
  ]

  // Parse CSV helper function
  function parseCSV(csvText: string) {
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())
    const data = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.replace(/"/g, "").trim())
      const row: any = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ""
      })
      data.push(row)
    }
    return data
  }

  // Normalize subreddit name for matching
  function normalizeSubredditName(name: string): string {
    return name.toLowerCase().trim().replace(/^r\//, "")
  }

  // Process qualitative data
  const qualitativeData = parseCSV(qualitativeCSV)
  console.log("Qualitative data sample:", qualitativeData.slice(0, 3))
  console.log("Total qualitative records:", qualitativeData.length)

  // Create normalized lookup maps
  const qualitativeMap = new Map()
  qualitativeData.forEach((item: any) => {
    const normalizedName = normalizeSubredditName(item.subreddit || "")
    if (normalizedName) {
      qualitativeMap.set(normalizedName, item)
    }
  })

  const quantitativeMap = new Map()
  simulatedQuantitativeData.forEach((item) => {
    const normalizedName = normalizeSubredditName(item.subreddit)
    quantitativeMap.set(normalizedName, item)
  })

  console.log("Qualitative subreddits:", Array.from(qualitativeMap.keys()))
  console.log("Quantitative subreddits:", Array.from(quantitativeMap.keys()))

  // Get all unique subreddit names (outer join)
  const allSubreddits = new Set([...qualitativeMap.keys(), ...quantitativeMap.keys()])
  console.log("All unique subreddits:", Array.from(allSubreddits))

  // Merge data with outer join approach
  const mergedData = Array.from(allSubreddits).map((normalizedSubreddit) => {
    const qualItem = qualitativeMap.get(normalizedSubreddit)
    const quantItem = quantitativeMap.get(normalizedSubreddit)

    // Warning for missing data
    if (!qualItem) {
      console.warn(`⚠️  Missing qualitative data for: ${normalizedSubreddit}`)
    }
    if (!quantItem) {
      console.warn(`⚠️  Missing quantitative data for: ${normalizedSubreddit}`)
    }

    // Use original subreddit name from whichever source has it
    const originalSubreddit = qualItem?.subreddit || quantItem?.subreddit || normalizedSubreddit

    const CHS_qual = qualItem ? Number(qualItem.CHS_qual) || 0 : 0
    const CHS_quan = quantItem ? Number(quantItem.CHS_quan) : 0

    // Calculate composite score: 0.4 * CHS_qual + 0.6 * CHS_quan
    const CHS_composite = Math.round(0.4 * CHS_qual + 0.6 * CHS_quan)

    // Add displayName (capitalize first letter)
    const displayName = originalSubreddit.charAt(0).toUpperCase() + originalSubreddit.slice(1)

    return {
      subreddit: originalSubreddit,
      displayName,
      normalizedSubreddit,
      CHS_qual,
      CHS_quan,
      CHS_composite,
      // Qualitative metrics (with fallbacks)
      Normalized_Sentiment: qualItem ? Number(qualItem.Normalized_Sentiment) || 0 : 0,
      Normalized_Civility: qualItem ? Number(qualItem.Normalized_Civility) || 0 : 0,
      Normalized_Empathy: qualItem ? Number(qualItem.Normalized_Empathy) || 0 : 0,
      Normalized_Helpfulness: qualItem ? Number(qualItem.Normalized_Helpfulness) || 0 : 0,
      Normalized_Relevance: qualItem ? Number(qualItem.Normalized_Relevance) || 0 : 0,
      Posts: quantItem?.Posts || quantItem?.posts || 0,
      Comments: quantItem?.Comments || quantItem?.comments || 0,
      Retention: quantItem?.Retention || quantItem?.retention || 0,
      Engagement: quantItem?.Engagement || quantItem?.engagement || 0,
      Subscribers: quantItem?.Subscribers || 0,
      Health_Grade: quantItem?.Health_Grade || quantItem?.Health_Grade || "N/A",
      CHI_quan: quantItem?.CHI_quan || quantItem?.CHS_quan || 0,
      Responsiveness: quantItem?.Responsiveness || quantItem?.responsiveness || 0,
      Interaction: quantItem?.Interaction || quantItem?.interaction || 0,
      Content_Factor: quantItem?.Content_Factor || quantItem?.['Content Factor'] || 0,
      Traffic_Factor: quantItem?.Traffic_Factor || quantItem?.['Traffic Factor'] || 0,
      // Data availability flags
      hasQualitativeData: !!qualItem,
      hasQuantitativeData: !!quantItem,
    }
  })

  // Sort by CHS_composite descending
  mergedData.sort((a, b) => b.CHS_composite - a.CHS_composite)

  console.log("Final merged data sample:", mergedData.slice(0, 3))
  console.log("Total merged records:", mergedData.length)
  console.log(
    "Records with both data types:",
    mergedData.filter((item) => item.hasQualitativeData && item.hasQuantitativeData).length,
  )
  console.log("Records missing qualitative data:", mergedData.filter((item) => !item.hasQualitativeData).length)
  console.log("Records missing quantitative data:", mergedData.filter((item) => !item.hasQuantitativeData).length)

  // Write the merged data to a JSON file
  const outputDir = "./data"
  const outputPath = `${outputDir}/latest-merged-chi-data.json`

  // Ensure the data directory exists
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  // Write the merged data to a JSON file
  writeFileSync(outputPath, JSON.stringify(mergedData, null, 2))
  console.log(`✅ Merged data written to ${outputPath}`)

  return mergedData
}

fetchAndMergeCHIDataFixed()
