// Script to fetch and merge the actual CHI data from both CSV files
async function fetchRealCHIData() {
  console.log("Fetching actual CHI data from both CSV files...")

  try {
    // Fetch qualitative metrics data
    const qualitativeResponse = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/subreddit_aggregated_results_sampled_20250719_201325-Vvb37HUXtyRsQBS5lNOy9bTeR8Z91Z.csv",
    )
    const qualitativeCSV = await qualitativeResponse.text()

    // Fetch quantitative CHI comparison data
    const quantitativeResponse = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reddit_chi_comparison_16july-BWoJDFZdmhLNXjQ2FJ9QcJqQBkeRSj.csv",
    )
    const quantitativeCSV = await quantitativeResponse.text()

    console.log("Qualitative CSV sample:", qualitativeCSV.slice(0, 500))
    console.log("Quantitative CSV sample:", quantitativeCSV.slice(0, 500))

    // Parse CSV helper function
    function parseCSV(csvText: string) {
      const lines = csvText.trim().split("\n")
      const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())
      const data = []

      console.log("CSV Headers:", headers)

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

    // Process quantitative data
    const quantitativeData = parseCSV(quantitativeCSV)
    console.log("Quantitative data sample:", quantitativeData.slice(0, 3))
    console.log("Total quantitative records:", quantitativeData.length)

    // Create normalized lookup maps
    const qualitativeMap = new Map()
    qualitativeData.forEach((item: any) => {
      const normalizedName = normalizeSubredditName(item.subreddit || "")
      if (normalizedName) {
        qualitativeMap.set(normalizedName, item)
        console.log(`Qualitative: ${normalizedName} -> ${item.subreddit}`)
      }
    })

    const quantitativeMap = new Map()
    quantitativeData.forEach((item: any) => {
      const normalizedName = normalizeSubredditName(item.subreddit || "")
      if (normalizedName) {
        quantitativeMap.set(normalizedName, item)
        console.log(`Quantitative: ${normalizedName} -> ${item.subreddit}`)
      }
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
      const CHS_quan = quantItem ? Number(quantItem.CHS_quan) || 0 : 0

      // Calculate composite score: 0.4 * CHS_qual + 0.6 * CHS_quan
      const CHS_composite = Math.round(0.4 * CHS_qual + 0.6 * CHS_quan)

      return {
        subreddit: originalSubreddit,
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
        // Quantitative metrics (with fallbacks)
        posts: quantItem ? Number(quantItem.posts) || 0 : 0,
        comments: quantItem ? Number(quantItem.comments) || 0 : 0,
        retention: quantItem ? Number(quantItem.retention) || 0 : 0,
        engagement: quantItem ? Number(quantItem.engagement) || 0 : 0,
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

    console.log("Final subreddit list:")
    mergedData.forEach((item, index) => {
      console.log(`${index + 1}. ${item.subreddit} (${item.CHS_composite})`)
    })

    return mergedData
  } catch (error) {
    console.error("Error fetching data:", error)
    return []
  }
}

fetchRealCHIData()
