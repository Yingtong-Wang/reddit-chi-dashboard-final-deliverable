import { writeFileSync, readFileSync, existsSync } from "fs"

async function processThisWeekData() {
  // Paths to this week's CSV files
  const qualitativePath = "./data/this-week-qualitative.csv"
  const quantitativePath = "./data/this-week-quantitative.csv"
  const existingDataPath = "./data/combined.json"

  // Read CSV files
  const qualitativeCSV = readFileSync(qualitativePath, 'utf-8')
  const quantitativeCSV = readFileSync(quantitativePath, 'utf-8')

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

  // Merge this week's data
  const allSubreddits = new Set([...qualitativeMap.keys(), ...quantitativeMap.keys()])
  const thisWeekData = Array.from(allSubreddits).map((subreddit) => {
    const qual = qualitativeMap.get(subreddit) || {}
    const quant = quantitativeMap.get(subreddit) || {}
    
    // Calculate CHS_composite (average of qualitative metrics)
    const chsQual = parseFloat(qual.CHS_qual) || 0
    const sentiment = parseFloat(qual.Normalized_Sentiment) || 0
    const civility = parseFloat(qual.Normalized_Civility) || 0
    const empathy = parseFloat(qual.Normalized_Empathy) || 0
    const helpfulness = parseFloat(qual.Normalized_Helpfulness) || 0
    const relevance = parseFloat(qual.Normalized_Relevance) || 0
    
    const chsComposite = Math.round((sentiment + civility + empathy + helpfulness + relevance) / 5)

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
      CHS_composite: chsComposite
    }
  })

  // Read existing data
  const existingData = JSON.parse(readFileSync(existingDataPath, 'utf-8'))

  // Create a map of existing data by subreddit
  const existingMap = new Map()
  existingData.forEach((item: any) => {
    const normalized = normalizeSubredditName(item.subreddit || "")
    if (normalized) existingMap.set(normalized, item)
  })

  // Merge with existing data (this week's data takes precedence for overlapping subreddits)
  const mergedData = [...existingData]
  
  thisWeekData.forEach((thisWeekItem) => {
    const normalized = normalizeSubredditName(thisWeekItem.subreddit)
    const existingIndex = mergedData.findIndex((item: any) => 
      normalizeSubredditName(item.subreddit) === normalized
    )
    
    if (existingIndex >= 0) {
      // Update existing entry with this week's data
      mergedData[existingIndex] = thisWeekItem
    } else {
      // Add new entry
      mergedData.push(thisWeekItem)
    }
  })

  // Write updated combined data
  writeFileSync(existingDataPath, JSON.stringify(mergedData, null, 2))
  console.log(`✅ Updated combined data with this week's data`)
  console.log(`📊 Total subreddits: ${mergedData.length}`)
  console.log(`🆕 This week's data: ${thisWeekData.length} subreddits`)
  
  // Create a separate file for this week's data only
  writeFileSync("./data/this-week-combined.json", JSON.stringify(thisWeekData, null, 2))
  console.log(`📁 This week's data saved to: ./data/this-week-combined.json`)
}

processThisWeekData().catch(console.error) 