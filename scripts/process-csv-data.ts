// Script to process CSV data and extract subreddit information
async function processCSVData() {
  console.log("Processing CSV data to extract subreddit information...")

  // Fetch all CSV files
  const qualitativeResponse = await fetch(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/subreddit_aggregated_results_sampled_20250719_201325-Vvb37HUXtyRsQBS5lNOy9bTeR8Z91Z.csv",
  )
  const qualitativeCSV = await qualitativeResponse.text()

  const farmingMetricsResponse = await fetch(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reddit_metrics_farming_20250716_151015-BWoJDFZdmhLNXjQ2FJ9QcJqQBkeRSj.csv",
  )
  const farmingMetricsCSV = await farmingMetricsResponse.text()

  const iCheckMoviesMetricsResponse = await fetch(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reddit_metrics_iCheckMovies_20250716_123550-NGjN7guktQ0gtOaT9SN0natqhtqWkU.csv",
  )
  const iCheckMoviesMetricsCSV = await iCheckMoviesMetricsResponse.text()

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

  // Process quantitative data
  const farmingData = parseCSV(farmingMetricsCSV)
  const iCheckMoviesData = parseCSV(iCheckMoviesMetricsCSV)

  console.log("Farming data sample:", farmingData.slice(0, 3))
  console.log("iCheckMovies data sample:", iCheckMoviesData.slice(0, 3))

  // Extract unique subreddits
  const subreddits = new Set<string>()

  // From qualitative data
  qualitativeData.forEach((row) => {
    if (row.subreddit) {
      subreddits.add(row.subreddit)
    }
  })

  // From quantitative data
  farmingData.forEach((row) => {
    if (row.subreddit) {
      subreddits.add(row.subreddit)
    }
  })

  iCheckMoviesData.forEach((row) => {
    if (row.subreddit) {
      subreddits.add(row.subreddit)
    }
  })

  console.log("Unique subreddits found:", Array.from(subreddits))

  return {
    qualitativeData,
    quantitativeData: {
      farming: farmingData,
      iCheckMovies: iCheckMoviesData,
    },
    subreddits: Array.from(subreddits),
  }
}

processCSVData()
