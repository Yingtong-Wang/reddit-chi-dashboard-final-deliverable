// Script to fetch and process CSV data
async function fetchAndProcessCSVData() {
  console.log("Fetching CSV data...")

  // Fetch qualitative metrics data
  const qualitativeResponse = await fetch(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/subreddit_aggregated_results_sampled_20250719_201325-Vvb37HUXtyRsQBS5lNOy9bTeR8Z91Z.csv",
  )
  const qualitativeCSV = await qualitativeResponse.text()

  // Fetch quantitative metrics data
  const farmingMetricsResponse = await fetch(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reddit_metrics_farming_20250716_151015-BWoJDFZdmhLNXjQ2FJ9QcJqQBkeRSj.csv",
  )
  const farmingMetricsCSV = await farmingMetricsResponse.text()

  const iCheckMoviesMetricsResponse = await fetch(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reddit_metrics_iCheckMovies_20250716_123550-NGjN7guktQ0gtOaT9SN0natqhtqWkU.csv",
  )
  const iCheckMoviesMetricsCSV = await iCheckMoviesMetricsResponse.text()

  const farmingCommentsResponse = await fetch(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reddit_comments_farming_20250716_151015-xmyIEy0ru7YlW1YCcXfzjqaExFVZ5O.csv",
  )
  const farmingCommentsCSV = await farmingCommentsResponse.text()

  console.log("Processing qualitative data...")
  console.log("Sample qualitative data:", qualitativeCSV.slice(0, 500))

  console.log("Processing quantitative data...")
  console.log("Sample farming metrics:", farmingMetricsCSV.slice(0, 500))
  console.log("Sample iCheckMovies metrics:", iCheckMoviesMetricsCSV.slice(0, 500))
  console.log("Sample farming comments:", farmingCommentsCSV.slice(0, 500))
}

fetchAndProcessCSVData()
