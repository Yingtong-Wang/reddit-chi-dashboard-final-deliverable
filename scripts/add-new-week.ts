import { writeFileSync, readFileSync, existsSync } from "fs"

interface WeekData {
  weekNumber: number
  startDate: string
  endDate: string
  qualitativeCsvPath?: string
  quantitativeCsvPath?: string
}

async function addNewWeek() {
  // Configuration for the new week
  const newWeek: WeekData = {
    weekNumber: 4, // Change this for each new week
    startDate: "Aug 5, 2024",
    endDate: "Aug 11, 2024",
    // Optional: specify CSV file paths if you have them
    // qualitativeCsvPath: "./data/new-week-qualitative.csv",
    // quantitativeCsvPath: "./data/new-week-quantitative.csv"
  }

  const weekId = `week-${newWeek.weekNumber}`
  const outputPath = `./data/${weekId}.json`

  // Check if week already exists
  if (existsSync(outputPath)) {
    console.log(`⚠️  Week ${newWeek.weekNumber} already exists at ${outputPath}`)
    console.log("Please increment the week number or remove the existing file.")
    return
  }

  // If CSV files are provided, process them
  if (newWeek.qualitativeCsvPath && newWeek.quantitativeCsvPath) {
    console.log(`📊 Processing CSV files for Week ${newWeek.weekNumber}...`)
    
    try {
      const qualitativeCSV = readFileSync(newWeek.qualitativeCsvPath, 'utf-8')
      const quantitativeCSV = readFileSync(newWeek.quantitativeCsvPath, 'utf-8')
      
      // Parse CSV and create combined data
      const combinedData = processCSVData(qualitativeCSV, quantitativeCSV)
      
      // Write to JSON file
      writeFileSync(outputPath, JSON.stringify(combinedData, null, 2))
      console.log(`✅ Week ${newWeek.weekNumber} data saved to ${outputPath}`)
      
    } catch (error) {
      console.error("❌ Error processing CSV files:", error)
      return
    }
  } else {
    // Create template data structure
    const templateData = createTemplateData(newWeek)
    writeFileSync(outputPath, JSON.stringify(templateData, null, 2))
    console.log(`📝 Template created for Week ${newWeek.weekNumber} at ${outputPath}`)
    console.log("Please add your data to this file manually.")
  }

  // Update the data context to include the new week
  updateDataContext(newWeek.weekNumber, newWeek.startDate, newWeek.endDate)
  
  console.log(`\n🎉 Week ${newWeek.weekNumber} setup complete!`)
  console.log(`📅 Date range: ${newWeek.startDate} - ${newWeek.endDate}`)
  console.log(`📁 Data file: ${outputPath}`)
}

function processCSVData(qualitativeCSV: string, quantitativeCSV: string) {
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

  // Merge data
  const allSubreddits = new Set([...qualitativeMap.keys(), ...quantitativeMap.keys()])
  const combined = Array.from(allSubreddits).map((subreddit) => {
    const qual = qualitativeMap.get(subreddit) || {}
    const quant = quantitativeMap.get(subreddit) || {}
    
    // Calculate CHS_composite
    const sentiment = parseFloat(qual.Normalized_Sentiment) || 0
    const civility = parseFloat(qual.Normalized_Civility) || 0
    const empathy = parseFloat(qual.Normalized_Empathy) || 0
    const helpfulness = parseFloat(qual.Normalized_Helpfulness) || 0
    const relevance = parseFloat(qual.Normalized_Relevance) || 0
    
    const chsComposite = Math.round((sentiment + civility + empathy + helpfulness + relevance) / 5)

    return {
      subreddit: qual.subreddit || quant.Subreddit || subreddit,
      CHS_qual: qual.CHS_qual || null,
      Normalized_Sentiment: qual.Normalized_Sentiment || null,
      Normalized_Civility: qual.Normalized_Civility || null,
      Normalized_Empathy: qual.Normalized_Empathy || null,
      Normalized_Helpfulness: qual.Normalized_Helpfulness || null,
      Normalized_Relevance: qual.Normalized_Relevance || null,
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

  return combined
}

function createTemplateData(week: WeekData) {
  // Create a template with sample data structure
  return [
    {
      subreddit: "ExampleSubreddit",
      CHS_qual: "500",
      Normalized_Sentiment: "450",
      Normalized_Civility: "500",
      Normalized_Empathy: "500",
      Normalized_Helpfulness: "500",
      Normalized_Relevance: "500",
      CHI_Score: "650.0",
      Subscribers: "1000000",
      Posts: "100",
      Members_Factor: "6.0",
      Content_Factor: "400.0",
      Traffic_Factor: "3.0",
      Responsiveness: "10.0",
      Interaction: "5.0",
      Health_Grade: "B",
      CHS_composite: 490
    }
  ]
}

function updateDataContext(weekNumber: number, startDate: string, endDate: string) {
  const contextPath = "./contexts/data-context.tsx"
  
  if (!existsSync(contextPath)) {
    console.log("⚠️  Data context file not found. Please update manually.")
    return
  }

  try {
    let contextContent = readFileSync(contextPath, 'utf-8')
    
    // Add import for new week
    const importRegex = /import week(\d+)Data from '@/data\/week-\d+\.json'/g
    const imports = contextContent.match(importRegex) || []
    const lastImport = imports[imports.length - 1]
    
    if (lastImport) {
      const newImport = `import week${weekNumber}Data from '@/data/week-${weekNumber}.json'`
      contextContent = contextContent.replace(lastImport, `${lastImport}\nimport week${weekNumber}Data from '@/data/week-${weekNumber}.json'`)
    }
    
    // Add to weekDataMap
    const mapRegex = /const weekDataMap: Record<string, DataItem\[\]> = \{([^}]+)\}/
    const mapMatch = contextContent.match(mapRegex)
    
    if (mapMatch) {
      const newMapEntry = `  'week-${weekNumber}': week${weekNumber}Data,`
      const updatedMap = `const weekDataMap: Record<string, DataItem[]> = {$1  'week-${weekNumber}': week${weekNumber}Data,\n}`
      contextContent = contextContent.replace(mapRegex, updatedMap)
    }
    
    // Add to weeks array
    const weeksRegex = /const weeks: WeekData\[\] = \[([^\]]+)\]/
    const weeksMatch = contextContent.match(weeksRegex)
    
    if (weeksMatch) {
      const newWeekEntry = `  {\n    id: 'week-${weekNumber}',\n    label: 'Week ${weekNumber}',\n    date: '${startDate}-${endDate}',\n    isCurrent: true\n  }`
      const updatedWeeks = `const weeks: WeekData[] = [$1  {\n    id: 'week-${weekNumber}',\n    label: 'Week ${weekNumber}',\n    date: '${startDate}-${endDate}',\n    isCurrent: true\n  }\n]`
      contextContent = contextContent.replace(weeksRegex, updatedWeeks)
    }
    
    // Update default selected week
    contextContent = contextContent.replace(
      /useState<string>\('week-\d+'\)/,
      `useState<string>('week-${weekNumber}')`
    )
    
    writeFileSync(contextPath, contextContent)
    console.log("✅ Data context updated successfully!")
    
  } catch (error) {
    console.error("❌ Error updating data context:", error)
    console.log("Please update the data context manually.")
  }
}

addNewWeek().catch(console.error) 