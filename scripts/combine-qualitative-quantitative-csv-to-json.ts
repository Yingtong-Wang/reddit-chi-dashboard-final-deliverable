import { writeFileSync, mkdirSync, existsSync } from "fs"

async function combineQualitativeQuantitativeCSVToJSON() {
  // URLs of the CSVs
  const qualitativeUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/subreddit_aggregated_results_sampled_20250719_201325-Vvb37HUXtyRsQBS5lNOy9bTeR8Z91Z.csv"
  const quantitativeUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Quant_reddit_chi_comparison_16july%20%282%29-h36lQlHyKcGWB2QKIsUJSwaNo9dn82.csv"

  // Fetch CSVs
  const [qualitativeResponse, quantitativeResponse] = await Promise.all([
    fetch(qualitativeUrl),
    fetch(quantitativeUrl)
  ])
  const qualitativeCSV = await qualitativeResponse.text()
  const quantitativeCSV = await quantitativeResponse.text()

  // Parse CSV
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

  const qualitativeData = parseCSV(qualitativeCSV)
  const quantitativeData = parseCSV(quantitativeCSV)

  // Create lookup maps by normalized subreddit name
  function normalizeSubredditName(name: string): string {
    return name.toLowerCase().trim().replace(/^r\//, "")
  }

  const qualitativeMap = new Map()
  qualitativeData.forEach((item: any) => {
    const normalized = normalizeSubredditName(item.subreddit || "")
    if (normalized) qualitativeMap.set(normalized, item)
  })

  const quantitativeMap = new Map()
  quantitativeData.forEach((item: any) => {
    const normalized = normalizeSubredditName(item.Subreddit || "")
    if (normalized) quantitativeMap.set(normalized, item)
  })

  // Merge data by subreddit (outer join)
  const allSubreddits = new Set([...qualitativeMap.keys(), ...quantitativeMap.keys()])
  const combined = Array.from(allSubreddits).map((subreddit) => {
    const qual = qualitativeMap.get(subreddit) || {}
    const quant = quantitativeMap.get(subreddit) || {}
    return {
      subreddit: qual.subreddit || quant.Subreddit || subreddit,
      // Qualitative fields
      CHS_qual: qual.CHS_qual || null,
      Normalized_Sentiment: qual.Normalized_Sentiment || null,
      Normalized_Civility: qual.Normalized_Civility || null,
      Normalized_Empathy: qual.Normalized_Empathy || null,
      Normalized_Helpfulness: qual.Normalized_Helpfulness || null,
      Normalized_Relevance: qual.Normalized_Relevance || null,
      // Quantitative fields
      CHI_Score: quant["CHI Score"] || null,
      Subscribers: quant.Subscribers || null,
      Posts: quant.Posts || null,
      Members_Factor: quant["Members Factor"] || null,
      Content_Factor: quant["Content Factor"] || null,
      Traffic_Factor: quant["Traffic Factor"] || null,
      Responsiveness: quant.Responsiveness || null,
      Interaction: quant.Interaction || null,
      Health_Grade: quant["Health Grade"] || null,
    }
  })

  // Write to data/combined.json
  const outputDir = "./data"
  const outputPath = `${outputDir}/combined.json`
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }
  writeFileSync(outputPath, JSON.stringify(combined, null, 2))
  console.log(`✅ Combined data written to ${outputPath}`)
}

combineQualitativeQuantitativeCSVToJSON() 