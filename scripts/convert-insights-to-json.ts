import fs from 'fs'
import path from 'path'

// Function to parse CSV with proper handling of quoted fields
function parseCSV(csvContent: string) {
  const lines = csvContent.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim())
  const data = lines.slice(1).map(line => {
    const obj: any = {}
    let currentField = ''
    let inQuotes = false
    let fieldIndex = 0
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        obj[headers[fieldIndex]] = currentField.trim()
        currentField = ''
        fieldIndex++
      } else {
        currentField += char
      }
    }
    
    // Add the last field
    obj[headers[fieldIndex]] = currentField.trim()
    
    return obj
  })
  return data
}

// Read and convert week 1 insights
const week1Csv = fs.readFileSync(path.join(process.cwd(), 'data', 'Expanded_Insights_July17.csv'), 'utf8')
const week1Insights = parseCSV(week1Csv)

// Read and convert week 2 insights
const week2Csv = fs.readFileSync(path.join(process.cwd(), 'data', 'Expanded_Insights_July25.csv'), 'utf8')
const week2Insights = parseCSV(week2Csv)

// Read and convert week 3 insights
// const week3Csv = fs.readFileSync(path.join(process.cwd(), 'data', 'insights-week3.csv'), 'utf8')
// const week3Insights = parseCSV(week3Csv)

// Create a map for easy lookup
const insightsMap: Record<string, Record<string, any>> = {
  'week-1': {},
  'week-2': {},
  'week-3': {}
}

// Process week 1 insights
week1Insights.forEach((insight: any) => {
  const subreddit = insight.Subreddit.replace('r/', '') // Remove 'r/' prefix
  insightsMap['week-1'][subreddit] = {
    insight: insight.Insight,
    nextStep: insight['Next Step']
  }
})

// Process week 2 insights
week2Insights.forEach((insight: any) => {
  const subreddit = insight.Subreddit.replace('r/', '') // Remove 'r/' prefix
  insightsMap['week-2'][subreddit] = {
    insight: insight.Insight,
    nextStep: insight['Next Step']
  }
})

// Process week 3 insights
// week3Insights.forEach((insight: any) => {
//   const subreddit = insight.Subreddit.replace('r/', '') // Remove 'r/' prefix
//   insightsMap['week-3'][subreddit] = {
//     insight: insight.Insight,
//     nextStep: insight['Next Step']
//   }
// })

// Write to JSON file
fs.writeFileSync(
  path.join(process.cwd(), 'data', 'insights.json'), 
  JSON.stringify(insightsMap, null, 2)
)

console.log('Converted insights CSV files to JSON format')
console.log(`Week 1: ${Object.keys(insightsMap['week-1']).length} subreddits`)
console.log(`Week 2: ${Object.keys(insightsMap['week-2']).length} subreddits`)
console.log(`Week 3: ${Object.keys(insightsMap['week-3']).length} subreddits`) 