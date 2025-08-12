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

// Read qualitative data
const qualitativeCsv = fs.readFileSync(path.join(process.cwd(), 'data', 'qualitative_week2.csv'), 'utf8')
const qualitativeData = parseCSV(qualitativeCsv)

// Read quantitative data
const quantitativeCsv = fs.readFileSync(path.join(process.cwd(), 'data', 'quantitative_week2.csv'), 'utf8')
const quantitativeData = parseCSV(quantitativeCsv)

// Create a map for quantitative data for easy lookup
const quantitativeMap: Record<string, any> = {}
quantitativeData.forEach((item: any) => {
  const subreddit = item.Subreddit.replace('r/', '') // Remove 'r/' prefix
  quantitativeMap[subreddit] = item
})

// Handle case differences for specific subreddits
const subredditMapping: Record<string, string> = {
  'ProductManagement': 'productmanagement',
  'Seattle': 'seattle'
}

// Merge the data
const mergedData = qualitativeData.map((qualItem: any) => {
  const subreddit = qualItem.subreddit
  const mappedSubreddit = subredditMapping[subreddit] || subreddit
  const quantItem = quantitativeMap[mappedSubreddit]
  
  if (!quantItem) {
    console.warn(`No quantitative data found for subreddit: ${subreddit} (mapped to: ${mappedSubreddit})`)
    return null
  }
  
  // Calculate CHS_composite (0.4 * CHS_qual + 0.6 * CHI_Score)
  const chsQual = parseFloat(qualItem.CHS_qual) || 0
  const chsQuan = parseFloat(quantItem['CHI Score']) || 0
  
  const chsComposite = Math.round(0.4 * chsQual + 0.6 * chsQuan)
  
  return {
    subreddit: subreddit,
    CHS_qual: qualItem.CHS_qual,
    Normalized_Sentiment: qualItem.Normalized_Sentiment,
    Normalized_Civility: qualItem.Normalized_Civility,
    Normalized_Empathy: qualItem.Normalized_Empathy,
    Normalized_Helpfulness: qualItem.Normalized_Helpfulness,
    Normalized_Relevance: qualItem.Normalized_Relevance,
    CHI_Score: quantItem['CHI Score'],
    Subscribers: quantItem.Subscribers,
    Posts: quantItem.Posts,
    Members_Factor: quantItem['Members Factor'],
    Content_Factor: quantItem['Content Factor'],
    Traffic_Factor: quantItem['Traffic Factor'],
    Responsiveness: quantItem.Responsiveness,
    Interaction: quantItem.Interaction,
    Health_Grade: quantItem['Health Grade'],
    CHS_composite: chsComposite
  }
}).filter(item => item !== null)

// Write to JSON file
fs.writeFileSync(
  path.join(process.cwd(), 'data', 'combined-week2.json'), 
  JSON.stringify(mergedData, null, 2)
)

console.log('Merged qualitative and quantitative week 2 data')
console.log(`Total subreddits: ${mergedData.length}`)
console.log('Created: data/combined-week2.json')

// Display first few entries for verification
console.log('\nFirst 3 entries:')
mergedData.slice(0, 3).forEach((item: any) => {
  console.log(`${item.subreddit}: CHS_qual=${item.CHS_qual}, CHS_composite=${item.CHS_composite}, Health_Grade=${item.Health_Grade}`)
}) 