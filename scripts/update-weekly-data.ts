import fs from 'fs'
import path from 'path'

// Read the combined data
const combinedData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'combined.json'), 'utf8'))

// Function to create week variations
function createWeekVariation(data: any[], weekNumber: number) {
  return data.map(item => {
    const variation = weekNumber === 2 ? 0.98 : 1.02 // Week 2: slight decrease, Week 3: slight increase
    
    return {
      ...item,
      CHS_qual: Math.round(Number(item.CHS_qual) * variation).toString(),
      CHS_composite: Math.round(Number(item.CHS_composite) * variation),
      CHI_Score: (Number(item.CHI_Score) * variation).toFixed(7),
      Subscribers: Math.round(Number(item.Subscribers) * variation).toString(),
      Normalized_Sentiment: Math.round(Number(item.Normalized_Sentiment) * variation).toString(),
      Normalized_Civility: Math.round(Number(item.Normalized_Civility) * variation).toString(),
      Normalized_Empathy: Math.round(Number(item.Normalized_Empathy) * variation).toString(),
      Normalized_Helpfulness: Math.round(Number(item.Normalized_Helpfulness) * variation).toString(),
      Normalized_Relevance: Math.round(Number(item.Normalized_Relevance) * variation).toString(),
      Responsiveness: (Number(item.Responsiveness) * variation).toFixed(2),
      Interaction: (Number(item.Interaction) * variation).toFixed(2),
      Content_Factor: (Number(item.Content_Factor) * variation).toFixed(7),
      Traffic_Factor: (Number(item.Traffic_Factor) * variation).toFixed(9),
      Members_Factor: (Number(item.Members_Factor) * variation).toFixed(9)
    }
  })
}

// Create week 2 data (slight decrease)
const week2Data = createWeekVariation(combinedData, 2)
fs.writeFileSync(path.join(process.cwd(), 'data', 'week-2.json'), JSON.stringify(week2Data, null, 2))

// Create week 3 data (slight increase)
const week3Data = createWeekVariation(combinedData, 3)
fs.writeFileSync(path.join(process.cwd(), 'data', 'week-3.json'), JSON.stringify(week3Data, null, 2))

console.log('Updated week-2.json and week-3.json with all 16 subreddits')
console.log(`Week 2: ${week2Data.length} subreddits`)
console.log(`Week 3: ${week3Data.length} subreddits`) 