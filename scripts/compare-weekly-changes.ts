import { readFileSync, writeFileSync } from "fs"

async function compareWeeklyChanges() {
  // Read both datasets
  const lastWeekData = JSON.parse(readFileSync("./data/last-week-backup.json", 'utf-8'))
  const thisWeekData = JSON.parse(readFileSync("./data/this-week-combined.json", 'utf-8'))

  // Create maps for easy lookup
  function normalizeSubredditName(name: string): string {
    return name.toLowerCase().trim().replace(/^r\//, "")
  }

  const lastWeekMap = new Map()
  lastWeekData.forEach((item: any) => {
    const normalized = normalizeSubredditName(item.subreddit)
    lastWeekMap.set(normalized, item)
  })

  const thisWeekMap = new Map()
  thisWeekData.forEach((item: any) => {
    const normalized = normalizeSubredditName(item.subreddit)
    thisWeekMap.set(normalized, item)
  })

  // Calculate changes for each subreddit
  const changes = []
  
  thisWeekData.forEach((thisWeekItem: any) => {
    const normalized = normalizeSubredditName(thisWeekItem.subreddit)
    const lastWeekItem = lastWeekMap.get(normalized)
    
    if (lastWeekItem) {
      const change = {
        subreddit: thisWeekItem.subreddit,
        // Qualitative changes
        CHS_qual_change: parseFloat(thisWeekItem.CHS_qual) - parseFloat(lastWeekItem.CHS_qual),
        Sentiment_change: parseFloat(thisWeekItem.Normalized_Sentiment) - parseFloat(lastWeekItem.Normalized_Sentiment),
        Civility_change: parseFloat(thisWeekItem.Normalized_Civility) - parseFloat(lastWeekItem.Normalized_Civility),
        Empathy_change: parseFloat(thisWeekItem.Normalized_Empathy) - parseFloat(lastWeekItem.Normalized_Empathy),
        Helpfulness_change: parseFloat(thisWeekItem.Normalized_Helpfulness) - parseFloat(lastWeekItem.Normalized_Helpfulness),
        Relevance_change: parseFloat(thisWeekItem.Normalized_Relevance) - parseFloat(lastWeekItem.Normalized_Relevance),
        // Quantitative changes
        CHI_Score_change: parseFloat(thisWeekItem.CHI_Score) - parseFloat(lastWeekItem.CHI_Score),
        Subscribers_change: parseInt(thisWeekItem.Subscribers) - parseInt(lastWeekItem.Subscribers),
        Posts_change: parseInt(thisWeekItem.Posts) - parseInt(lastWeekItem.Posts),
        Responsiveness_change: parseFloat(thisWeekItem.Responsiveness) - parseFloat(lastWeekItem.Responsiveness),
        Interaction_change: parseFloat(thisWeekItem.Interaction) - parseFloat(lastWeekItem.Interaction),
        CHS_composite_change: parseInt(thisWeekItem.CHS_composite) - parseInt(lastWeekItem.CHS_composite),
        // Current values
        current_CHS_qual: thisWeekItem.CHS_qual,
        current_CHI_Score: thisWeekItem.CHI_Score,
        current_Subscribers: thisWeekItem.Subscribers,
        current_Health_Grade: thisWeekItem.Health_Grade
      }
      changes.push(change)
    }
  })

  // Sort by biggest changes
  const sortedByCHSChange = [...changes].sort((a, b) => Math.abs(b.CHS_qual_change) - Math.abs(a.CHS_qual_change))
  const sortedByCHIChange = [...changes].sort((a, b) => Math.abs(b.CHI_Score_change) - Math.abs(a.CHI_Score_change))
  const sortedBySubscriberChange = [...changes].sort((a, b) => Math.abs(b.Subscribers_change) - Math.abs(a.Subscribers_change))

  // Create summary report
  const summary = {
    total_subreddits: changes.length,
    biggest_improvements: {
      CHS_qual: sortedByCHSChange.filter(c => c.CHS_qual_change > 0).slice(0, 5),
      CHI_Score: sortedByCHIChange.filter(c => c.CHI_Score_change > 0).slice(0, 5),
      Subscribers: sortedBySubscriberChange.filter(c => c.Subscribers_change > 0).slice(0, 5)
    },
    biggest_declines: {
      CHS_qual: sortedByCHSChange.filter(c => c.CHS_qual_change < 0).slice(0, 5),
      CHI_Score: sortedByCHIChange.filter(c => c.CHI_Score_change < 0).slice(0, 5),
      Subscribers: sortedBySubscriberChange.filter(c => c.Subscribers_change < 0).slice(0, 5)
    },
    all_changes: changes
  }

  // Write comparison data
  writeFileSync("./data/weekly-comparison.json", JSON.stringify(summary, null, 2))
  console.log(`✅ Weekly comparison saved to: ./data/weekly-comparison.json`)
  
  // Print summary to console
  console.log(`\n📊 Weekly Changes Summary:`)
  console.log(`Total subreddits analyzed: ${summary.total_subreddits}`)
  
  console.log(`\n🚀 Top 3 Improvements (CHS_qual):`)
  summary.biggest_improvements.CHS_qual.slice(0, 3).forEach((item, i) => {
    console.log(`${i + 1}. ${item.subreddit}: +${item.CHS_qual_change.toFixed(1)}`)
  })
  
  console.log(`\n📉 Top 3 Declines (CHS_qual):`)
  summary.biggest_declines.CHS_qual.slice(0, 3).forEach((item, i) => {
    console.log(`${i + 1}. ${item.subreddit}: ${item.CHS_qual_change.toFixed(1)}`)
  })
  
  console.log(`\n📈 Top 3 Subscriber Growth:`)
  summary.biggest_improvements.Subscribers.slice(0, 3).forEach((item, i) => {
    console.log(`${i + 1}. ${item.subreddit}: +${item.Subscribers_change.toLocaleString()}`)
  })
}

compareWeeklyChanges().catch(console.error) 