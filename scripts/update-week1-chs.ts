import fs from 'fs'
import path from 'path'

// Read the current combined.json (week 1 data)
const week1Data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'combined.json'), 'utf8'))

// Update CHS_composite calculations using correct formula: 0.4 * CHS_qual + 0.6 * CHI_Score
const updatedWeek1Data = week1Data.map((item: any) => {
  const chsQual = parseFloat(item.CHS_qual) || 0
  const chsQuan = parseFloat(item.CHI_Score) || 0
  
  const chsComposite = Math.round(0.4 * chsQual + 0.6 * chsQuan)
  
  return {
    ...item,
    CHS_composite: chsComposite
  }
})

// Write back to combined.json
fs.writeFileSync(
  path.join(process.cwd(), 'data', 'combined.json'), 
  JSON.stringify(updatedWeek1Data, null, 2)
)

console.log('Updated Week 1 CHS_composite calculations')
console.log(`Total subreddits: ${updatedWeek1Data.length}`)

// Display first few entries for verification
console.log('\nFirst 3 entries:')
updatedWeek1Data.slice(0, 3).forEach((item: any) => {
  console.log(`${item.subreddit}: CHS_qual=${item.CHS_qual}, CHI_Score=${parseFloat(item.CHI_Score).toFixed(2)}, CHS_composite=${item.CHS_composite}`)
}) 