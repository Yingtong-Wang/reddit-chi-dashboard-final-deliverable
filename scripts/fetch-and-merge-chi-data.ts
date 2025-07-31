// Script to fetch and merge CHI data from both CSV files
async function fetchAndMergeCHIData() {
  console.log("Fetching CHI data from both CSV files...")

  // Fetch qualitative metrics data
  const qualitativeResponse = await fetch(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/subreddit_aggregated_results_sampled_20250719_201325-Vvb37HUXtyRsQBS5lNOy9bTeR8Z91Z.csv",
  )
  const qualitativeCSV = await qualitativeResponse.text()

  // Fetch quantitative CHI comparison data
  const quantitativeResponse = await fetch(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reddit_chi_comparison_16july-placeholder.csv", // Replace with actual URL
  )

  // For now, let's simulate the quantitative data structure
  const simulatedQuantitativeData = [
    { subreddit: "personalfinance", CHS_quan: 720, posts: 2156, comments: 45678, retention: 0.85, engagement: 0.78 },
    { subreddit: "farming", CHS_quan: 680, posts: 1247, comments: 18543, retention: 0.92, engagement: 0.87 },
    { subreddit: "iCheckMovies", CHS_quan: 420, posts: 892, comments: 3421, retention: 0.65, engagement: 0.42 },
    { subreddit: "AskReddit", CHS_quan: 580, posts: 8500, comments: 125000, retention: 0.72, engagement: 0.68 },
    { subreddit: "technology", CHS_quan: 650, posts: 3200, comments: 67800, retention: 0.79, engagement: 0.74 },
    { subreddit: "TwoXChromosomes", CHS_quan: 590, posts: 1800, comments: 32400, retention: 0.76, engagement: 0.71 },
    { subreddit: "Parenting", CHS_quan: 750, posts: 980, comments: 15600, retention: 0.88, engagement: 0.82 },
    { subreddit: "Seattle", CHS_quan: 480, posts: 1200, comments: 18900, retention: 0.69, engagement: 0.58 },
  ]

  // Parse CSV helper function
  function parseCSV(csvText: string) {
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, ""))
    const data = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.replace(/"/g, ""))
      const row: any = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ""
      })
      data.push(row)
    }
    return data
  }

  // Process qualitative data
  const qualitativeData = parseCSV(qualitativeCSV)
  console.log("Qualitative data sample:", qualitativeData.slice(0, 3))

  // Merge data by subreddit
  const mergedData = qualitativeData.map((qualItem: any) => {
    const quantItem = simulatedQuantitativeData.find((q) => q.subreddit === qualItem.subreddit)

    const CHS_qual = Number(qualItem.CHS_qual) || 0
    const CHS_quan = quantItem ? Number(quantItem.CHS_quan) : 0

    // Calculate composite score: 0.4 * CHS_qual + 0.6 * CHS_quan
    const CHS_composite = Math.round(0.4 * CHS_qual + 0.6 * CHS_quan)

    return {
      subreddit: qualItem.subreddit,
      CHS_qual,
      CHS_quan,
      CHS_composite,
      Normalized_Sentiment: Number(qualItem.Normalized_Sentiment) || 0,
      Normalized_Civility: Number(qualItem.Normalized_Civility) || 0,
      Normalized_Empathy: Number(qualItem.Normalized_Empathy) || 0,
      Normalized_Helpfulness: Number(qualItem.Normalized_Helpfulness) || 0,
      Normalized_Relevance: Number(qualItem.Normalized_Relevance) || 0,
      // Quantitative metrics
      posts: quantItem?.posts || 0,
      comments: quantItem?.comments || 0,
      retention: quantItem?.retention || 0,
      engagement: quantItem?.engagement || 0,
    }
  })

  console.log("Merged data sample:", mergedData.slice(0, 3))
  console.log(
    "Available subreddits:",
    mergedData.map((item) => item.subreddit),
  )

  return mergedData
}

fetchAndMergeCHIData()
