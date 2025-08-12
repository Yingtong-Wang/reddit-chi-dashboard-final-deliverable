import fs from 'fs'
import path from 'path'

// Read the current week-3.json data
const week3Data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'week-3.json'), 'utf8'))

// Update CHS_composite calculations using correct formula: 0.4 * CHS_qual + 0.6 * CHI_Score
const updatedWeek3Data = week3Data.map((item: any) => {
  const chsQual = parseFloat(item.CHS_qual) || 0
  const chsQuan = parseFloat(item.CHI_Score) || 0
  
  const chsComposite = Math.round(0.4 * chsQual + 0.6 * chsQuan)
  
  return {
    ...item,
    CHS_composite: chsComposite
  }
})

// Write back to week-3.json
fs.writeFileSync(
  path.join(process.cwd(), 'data', 'week-3.json'), 
  JSON.stringify(updatedWeek3Data, null, 2)
)

console.log('Updated Week 3 CHS_composite calculations')
console.log(`Total subreddits: ${updatedWeek3Data.length}`)

// Display first few entries for verification
console.log('\nFirst 3 entries:')
updatedWeek3Data.slice(0, 3).forEach((item: any) => {
  console.log(`${item.subreddit}: CHS_qual=${item.CHS_qual}, CHI_Score=${parseFloat(item.CHI_Score).toFixed(2)}, CHS_composite=${item.CHS_composite}`)
}) 