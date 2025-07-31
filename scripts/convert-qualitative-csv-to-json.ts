import { writeFileSync, mkdirSync, existsSync } from "fs"

async function convertQualitativeCSVToJSON() {
  // URL of the Qualitative CSV
  const csvUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/subreddit_aggregated_results_sampled_20250719_201325-Vvb37HUXtyRsQBS5lNOy9bTeR8Z91Z.csv"
  const response = await fetch(csvUrl)
  const csvText = await response.text()

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

  const qualitativeData = parseCSV(csvText)

  // Write to data/qualitative.json
  const outputDir = "./data"
  const outputPath = `${outputDir}/qualitative.json`
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }
  writeFileSync(outputPath, JSON.stringify(qualitativeData, null, 2))
  console.log(`✅ Qualitative data written to ${outputPath}`)
}

convertQualitativeCSVToJSON() 