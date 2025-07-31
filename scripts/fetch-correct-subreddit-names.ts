// Script to fetch and process the correct subreddit names from CSV files
async function fetchCorrectSubredditNames() {
  console.log("Fetching correct subreddit names from CSV files...")

  try {
    // Fetch quantitative CHI metrics data (updated file)
    const quantitativeResponse = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Quant_reddit_chi_comparison_16july%20%282%29-h36lQlHyKcGWB2QKIsUJSwaNo9dn82.csv",
    )
    const quantitativeCSV = await quantitativeResponse.text()

    // Fetch qualitative CHS scores data (updated file)
    const qualitativeResponse = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/subreddit_aggregated_results_sampled_20250719_201325-CwFeRswXmQA9zNyZIUvciOdgmNv52K.csv",
    )
    const qualitativeCSV = await qualitativeResponse.text()

    console.log("Quantitative CSV sample:", quantitativeCSV.slice(0, 500))
    console.log("Qualitative CSV sample:", qualitativeCSV.slice(0, 500))

    // Enhanced CSV parser with better handling for complex data
    function parseCSV(csvText: string) {
      const lines = csvText.trim().split("\n")
      const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())
      const data = []

      console.log("CSV Headers:", headers)

      for (let i = 1; i < lines.length; i++) {
        // Handle CSV parsing with potential commas in quoted fields
        const line = lines[i]
        const values = []
        let current = ""
        let inQuotes = false

        for (let j = 0; j < line.length; j++) {
          const char = line[j]
          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === "," && !inQuotes) {
            values.push(current.trim())
            current = ""
          } else {
            current += char
          }
        }
        values.push(current.trim()) // Add the last value

        const row: any = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ""
        })
        data.push(row)
      }
      return data
    }

    // Function to normalize subreddit names for matching while preserving original formatting
    function normalizeForMatching(name: string): string {
      return name.toLowerCase().trim().replace(/^r\//, "")
    }

    // Function to properly format subreddit names for display
    function formatSubredditForDisplay(name: string): string {
      // Remove r/ prefix if present
      const cleaned = name.replace(/^r\//, "").trim()

      // Preserve original casing from CSV data
      return cleaned
    }

    // Process quantitative data
    const quantitativeData = parseCSV(quantitativeCSV)
    console.log("Quantitative data sample:", quantitativeData.slice(0, 3))
    console.log("Total quantitative records:", quantitativeData.length)

    // Process qualitative data
    const qualitativeData = parseCSV(qualitativeCSV)
    console.log("Qualitative data sample:", qualitativeData.slice(0, 3))
    console.log("Total qualitative records:", qualitativeData.length)

    // Create normalized lookup maps with original names preserved
    const quantitativeMap = new Map()
    quantitativeData.forEach((item: any) => {
      const originalName = item.Subreddit || ""
      const normalizedName = normalizeForMatching(originalName)
      if (normalizedName && originalName) {
        quantitativeMap.set(normalizedName, {
          originalName: originalName,
          displayName: formatSubredditForDisplay(originalName),
          CHI_Score: Number.parseFloat(item["CHI Score"]) || 0,
          Subscribers: Number.parseInt(item.Subscribers) || 0,
          Posts: Number.parseInt(item.Posts) || 0,
          Members_Factor: Number.parseFloat(item["Members Factor"]) || 0,
          Content_Factor: Number.parseFloat(item["Content Factor"]) || 0,
          Traffic_Factor: Number.parseFloat(item["Traffic Factor"]) || 0,
          Responsiveness: Number.parseFloat(item.Responsiveness) || 0,
          Interaction: Number.parseFloat(item.Interaction) || 0,
          Health_Grade: item["Health Grade"] || "N/A",
        })
        console.log(
          `Quantitative: ${normalizedName} -> Original: "${originalName}" -> Display: "${formatSubredditForDisplay(originalName)}"`,
        )
      }
    })

    const qualitativeMap = new Map()
    qualitativeData.forEach((item: any) => {
      const originalName = item.subreddit || ""
      const normalizedName = normalizeForMatching(originalName)
      if (normalizedName && originalName) {
        qualitativeMap.set(normalizedName, {
          originalName: originalName,
          displayName: formatSubredditForDisplay(originalName),
          CHS_qual: Number.parseFloat(item.CHS_qual) || 0,
          Normalized_Sentiment: Number.parseFloat(item.Normalized_Sentiment) || 0,
          Normalized_Civility: Number.parseFloat(item.Normalized_Civility) || 0,
          Normalized_Empathy: Number.parseFloat(item.Normalized_Empathy) || 0,
          Normalized_Helpfulness: Number.parseFloat(item.Normalized_Helpfulness) || 0,
          Normalized_Relevance: Number.parseFloat(item.Normalized_Relevance) || 0,
        })
        console.log(
          `Qualitative: ${normalizedName} -> Original: "${originalName}" -> Display: "${formatSubredditForDisplay(originalName)}"`,
        )
      }
    })

    console.log("Quantitative subreddits:", Array.from(quantitativeMap.keys()))
    console.log("Qualitative subreddits:", Array.from(qualitativeMap.keys()))

    // Get all unique subreddit names (outer join)
    const allSubreddits = new Set([...quantitativeMap.keys(), ...qualitativeMap.keys()])
    console.log("All unique subreddits:", Array.from(allSubreddits))

    // Merge data with outer join approach, preserving original names
    const mergedData = Array.from(allSubreddits).map((normalizedSubreddit) => {
      const quantItem = quantitativeMap.get(normalizedSubreddit)
      const qualItem = qualitativeMap.get(normalizedSubreddit)

      // Warning for missing data
      if (!quantItem) {
        console.warn(`⚠️  Missing quantitative data for: ${normalizedSubreddit}`)
      }
      if (!qualItem) {
        console.warn(`⚠️  Missing qualitative data for: ${normalizedSubreddit}`)
      }

      // Use original subreddit name from whichever source has it, prioritizing quantitative
      const originalSubreddit = quantItem?.originalName || qualItem?.originalName || normalizedSubreddit
      const displayName =
        quantItem?.displayName || qualItem?.displayName || formatSubredditForDisplay(normalizedSubreddit)

      const CHS_qual = qualItem ? qualItem.CHS_qual : 0
      const CHI_quan = quantItem ? quantItem.CHI_Score : 0

      // Calculate composite score: 0.4 * CHS_qual + 0.6 * CHI_quan
      const CHS_composite = Math.round(0.4 * CHS_qual + 0.6 * CHI_quan)

      return {
        subreddit: originalSubreddit,
        displayName: displayName,
        normalizedSubreddit,
        CHS_qual,
        CHI_quan,
        CHS_composite,
        // Qualitative metrics (with fallbacks)
        Normalized_Sentiment: qualItem ? qualItem.Normalized_Sentiment : 0,
        Normalized_Civility: qualItem ? qualItem.Normalized_Civility : 0,
        Normalized_Empathy: qualItem ? qualItem.Normalized_Empathy : 0,
        Normalized_Helpfulness: qualItem ? qualItem.Normalized_Helpfulness : 0,
        Normalized_Relevance: qualItem ? qualItem.Normalized_Relevance : 0,
        // Quantitative metrics (with fallbacks)
        Subscribers: quantItem ? quantItem.Subscribers : 0,
        Posts: quantItem ? quantItem.Posts : 0,
        Members_Factor: quantItem ? quantItem.Members_Factor : 0,
        Content_Factor: quantItem ? quantItem.Content_Factor : 0,
        Traffic_Factor: quantItem ? quantItem.Traffic_Factor : 0,
        Responsiveness: quantItem ? quantItem.Responsiveness : 0,
        Interaction: quantItem ? quantItem.Interaction : 0,
        Health_Grade: quantItem ? quantItem.Health_Grade : "N/A",
        // Data availability flags
        hasQualitativeData: !!qualItem,
        hasQuantitativeData: !!quantItem,
      }
    })

    // Sort by CHS_composite descending
    mergedData.sort((a, b) => b.CHS_composite - a.CHS_composite)

    console.log("Final merged data with correct names:")
    mergedData.forEach((item, index) => {
      if (index < 20) {
        // Show top 20
        console.log(
          `${index + 1}. Original: "${item.subreddit}" | Display: "${item.displayName}" | Composite: ${item.CHS_composite}`,
        )
      }
    })

    console.log("Total merged records:", mergedData.length)
    console.log(
      "Records with both data types:",
      mergedData.filter((item) => item.hasQualitativeData && item.hasQuantitativeData).length,
    )

    return mergedData
  } catch (error) {
    console.error("Error fetching correct subreddit names:", error)
    return []
  }
}

fetchCorrectSubredditNames()
